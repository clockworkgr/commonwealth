import {
  Actor,
  InvalidActor,
  InvalidInput,
  InvalidState,
  command,
  dispose,
  query,
} from '@hicommonwealth/core';
import { ChainBase, ChainType } from '@hicommonwealth/shared';
import { Chance } from 'chance';
import { afterAll, assert, beforeAll, describe, expect, test } from 'vitest';
import {
  CreateCommunity,
  CreateGroup,
  DeleteGroup,
  DeleteGroupErrors,
  DeleteTopic,
  Errors,
  GetCommunities,
  MAX_GROUPS_PER_COMMUNITY,
  UpdateCommunity,
  UpdateCommunityErrors,
} from '../../src/community';
import { models } from '../../src/database';
import type {
  ChainNodeAttributes,
  CommunityAttributes,
} from '../../src/models';
import { seed } from '../../src/tester';

const chance = Chance();

function buildCreateGroupPayload(community_id: string, topics: number[] = []) {
  return {
    community_id,
    metadata: {
      name: chance.name(),
      description: chance.sentence(),
      required_requirements: 1,
      membership_ttl: 100,
    },
    requirements: [],
    topics,
  };
}

describe('Community lifecycle', () => {
  let ethNode: ChainNodeAttributes, edgewareNode: ChainNodeAttributes;
  let community: CommunityAttributes;
  let superAdminActor: Actor, adminActor: Actor, memberActor: Actor;
  const custom_domain = 'custom';

  beforeAll(async () => {
    const [_ethNode] = await seed('ChainNode', { eth_chain_id: 1 });
    const [_edgewareNode] = await seed('ChainNode', {
      name: 'Edgeware Mainnet',
    });
    const [superadmin] = await seed('User', { isAdmin: true });
    const [admin] = await seed('User', { isAdmin: false });
    const [member] = await seed('User', { isAdmin: false });
    const [base] = await seed('Community', {
      chain_node_id: _ethNode!.id!,
      base: ChainBase.Ethereum,
      active: true,
      lifetime_thread_count: 0,
      profile_count: 1,
      Addresses: [
        {
          role: 'member',
          user_id: superadmin!.id,
        },
        {
          role: 'admin',
          user_id: admin!.id,
        },
        {
          role: 'member',
          user_id: member!.id,
        },
      ],
      custom_domain,
    });

    ethNode = _ethNode!;
    edgewareNode = _edgewareNode!;
    superAdminActor = {
      user: {
        id: superadmin!.id!,
        email: superadmin!.email!,
        isAdmin: superadmin!.isAdmin!,
      },
      address: base?.Addresses?.at(0)?.address,
    };
    adminActor = {
      user: { id: admin!.id!, email: admin!.email!, isAdmin: admin!.isAdmin! },
      address: base?.Addresses?.at(1)?.address,
    };
    memberActor = {
      user: {
        id: member!.id!,
        email: member!.email!,
        isAdmin: member!.isAdmin!,
      },
      address: base?.Addresses?.at(2)?.address,
    };
  });

  afterAll(async () => {
    await dispose()();
  });

  test('should create community', async () => {
    const name = chance.name();
    const result = await command(CreateCommunity(), {
      actor: adminActor,
      payload: {
        id: name,
        type: ChainType.Offchain,
        name,
        default_symbol: name.substring(0, 8).replace(' ', ''),
        network: 'network',
        base: ChainBase.Ethereum,
        eth_chain_id: ethNode.eth_chain_id!,
        social_links: [],
        user_address: adminActor.address!,
        node_url: ethNode.url,
        directory_page_enabled: false,
        tags: [],
      },
    });

    expect(result?.community?.id).toBe(name);
    expect(result?.admin_address).toBe(adminActor.address);
    // connect results
    community = result!.community! as CommunityAttributes;

    // create super admin address
    await models.Address.create({
      user_id: superAdminActor.user.id,
      address: superAdminActor.address!,
      community_id: community.id,
      is_user_default: true,
      role: 'admin',
      last_active: new Date(),
      ghost_address: false,
      is_banned: false,
      verification_token: '123',
    });
  });

  describe('groups', () => {
    test('should fail to query community via has_groups when none exists', async () => {
      const communityResults = await query(GetCommunities(), {
        actor: superAdminActor,
        payload: { has_groups: true } as any,
      });
      expect(communityResults?.results).to.have.length(0);
    });

    test('should create group when none exists', async () => {
      const payload = buildCreateGroupPayload(community.id);
      const results = await command(CreateGroup(), {
        actor: adminActor,
        payload,
      });
      expect(results?.groups?.at(0)?.metadata).to.includes(payload.metadata);

      const communityResults = await query(GetCommunities(), {
        actor: superAdminActor,
        payload: { has_groups: true } as any,
      });
      expect(communityResults?.results?.at(0)?.id).to.equal(
        payload.community_id,
      );
    });

    test('should fail group creation when group with same id found', async () => {
      const payload = buildCreateGroupPayload(community.id);
      await command(CreateGroup(), {
        actor: adminActor,
        payload,
      });
      await expect(() =>
        command(CreateGroup(), {
          actor: adminActor,
          payload,
        }),
      ).rejects.toThrow(InvalidState);
    });

    test('should fail group creation when sending invalid topics', async () => {
      await expect(
        command(CreateGroup(), {
          actor: adminActor,
          payload: buildCreateGroupPayload(community.id, [1, 2, 3]),
        }),
      ).rejects.toThrow(Errors.InvalidTopics);
    });

    test('should delete group', async () => {
      const created = await command(CreateGroup(), {
        actor: adminActor,
        payload: buildCreateGroupPayload(community.id),
      });
      const group_id = created!.groups!.at(0)!.id!;
      const deleted = await command(DeleteGroup(), {
        actor: adminActor,
        payload: { community_id: community.id, group_id },
      });
      expect(deleted?.community_id).toBe(community.id);
      expect(deleted?.group_id).toBe(group_id);
    });

    test('should delete group as super admin', async () => {
      const created = await command(CreateGroup(), {
        actor: superAdminActor,
        payload: buildCreateGroupPayload(community.id),
      });
      const group_id = created!.groups!.at(0)!.id!;
      const deleted = await command(DeleteGroup(), {
        actor: superAdminActor,
        payload: { community_id: community.id, group_id },
      });
      expect(deleted?.community_id).toBe(community.id);
      expect(deleted?.group_id).toBe(group_id);
    });

    test('should throw when trying to delete group that is system managed', async () => {
      const created = await command(CreateGroup(), {
        actor: adminActor,
        payload: {
          ...buildCreateGroupPayload(community.id),
        },
      });
      const group_id = created!.groups!.at(0)!.id!;
      await models.Group.update(
        { is_system_managed: true },
        { where: { id: group_id } },
      );
      await expect(() =>
        command(DeleteGroup(), {
          actor: adminActor,
          payload: { community_id: community.id, group_id },
        }),
      ).rejects.toThrow(DeleteGroupErrors.SystemManaged);
    });

    test('should fail group creation when community reached max number of groups allowed', async () => {
      await expect(async () => {
        for (let i = 0; i <= MAX_GROUPS_PER_COMMUNITY; i++) {
          await command(CreateGroup(), {
            actor: adminActor,
            payload: buildCreateGroupPayload(community.id),
          });
        }
      }).rejects.toThrow(Errors.MaxGroups);
    });
  });

  describe('topics', () => {
    test('should delete a topic', async () => {
      // TODO: use CreateTopic
      const topic = await models.Topic.create({
        community_id: community.id,
        name: 'hhh',
        featured_in_new_post: false,
        featured_in_sidebar: false,
        description: '',
        group_ids: [],
      });

      const response = await command(DeleteTopic(), {
        actor: adminActor,
        payload: { community_id: community.id, topic_id: topic!.id! },
      });
      expect(response?.topic_id).to.equal(topic.id);
    });

    test('should throw if not authorized', async () => {
      // TODO: use CreateTopic
      const topic = await models.Topic.create({
        community_id: community.id,
        name: 'hhh',
        featured_in_new_post: false,
        featured_in_sidebar: false,
        description: '',
        group_ids: [],
      });

      await expect(
        command(DeleteTopic(), {
          actor: memberActor,
          payload: { community_id: community.id, topic_id: topic!.id! },
        }),
      ).rejects.toThrow(InvalidActor);
    });
  });

  describe('updates', () => {
    const baseRequest = {
      default_symbol: 'EDG',
      base: ChainBase.Substrate,
      icon_url: 'assets/img/protocols/edg.png',
      active: true,
      type: ChainType.Chain,
      social_links: [],
    };

    test('should update community', async () => {
      const updated = await command(UpdateCommunity(), {
        actor: adminActor,
        payload: {
          ...baseRequest,
          id: community.id,
          chain_node_id: ethNode.id,
          directory_page_enabled: true,
          directory_page_chain_node_id: ethNode.id,
          type: ChainType.Offchain,
        },
      });

      assert.equal(updated?.directory_page_enabled, true);
      assert.equal(updated?.directory_page_chain_node_id, ethNode.id);
      assert.equal(updated?.type, 'offchain');
    });

    test('should remove directory', async () => {
      const updated = await command(UpdateCommunity(), {
        actor: adminActor,
        payload: {
          ...baseRequest,
          id: community.id,
          chain_node_id: ethNode.id,
          directory_page_enabled: false,
          directory_page_chain_node_id: null,
          type: ChainType.Chain,
        },
      });

      assert.equal(updated?.directory_page_enabled, false);
      assert.equal(updated?.directory_page_chain_node_id, null);
      assert.equal(updated?.type, 'chain');
    });

    test('should throw if snapshot not found', async () => {
      await expect(() =>
        command(UpdateCommunity(), {
          actor: adminActor,
          payload: {
            ...baseRequest,
            id: community.id,
            snapshot: ['not-found'],
          },
        }),
      ).rejects.toThrow(InvalidInput);
    });

    test('should throw if namespace present but no transaction hash', async () => {
      await expect(() =>
        command(UpdateCommunity(), {
          actor: adminActor,
          payload: {
            ...baseRequest,
            id: community.id,
            namespace: 'tempNamespace',
            chain_node_id: 1263,
          },
        }),
      ).rejects.toThrow(UpdateCommunityErrors.InvalidTransactionHash);
    });

    test('should throw if actor is not admin', async () => {
      await expect(() =>
        command(UpdateCommunity(), {
          actor: memberActor,
          payload: {
            ...baseRequest,
            id: community.id,
            namespace: 'tempNamespace',
            transactionHash: '0x1234',
            chain_node_id: edgewareNode!.id!,
          },
        }),
      ).rejects.toThrow(InvalidActor);
    });

    // TODO: implement when we can add members via commands
    test.skip('should throw if chain node of community does not match supported chain', async () => {
      await expect(() =>
        command(UpdateCommunity(), {
          actor: superAdminActor,
          payload: {
            ...baseRequest,
            id: community.id,
            namespace: 'tempNamespace',
            transactionHash: '0x1234',
            chain_node_id: edgewareNode!.id!,
          },
        }),
      ).rejects.toThrow('Namespace not supported on selected chain');
    });
  });
});
