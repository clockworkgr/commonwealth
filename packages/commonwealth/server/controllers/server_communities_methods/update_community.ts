/* eslint-disable no-continue */
import { AppError } from '@hicommonwealth/core';
import {
  checkSnapshotObjectExists,
  commonProtocol,
  CommunityAttributes,
  UserInstance,
} from '@hicommonwealth/model';
import { ChainBase } from '@hicommonwealth/shared';
import { MixpanelCommunityInteractionEvent } from '../../../shared/analytics/types';
import { urlHasValidHTTPPrefix } from '../../../shared/utils';
import { ALL_COMMUNITIES } from '../../middleware/databaseValidationService';
import { TrackOptions } from '../server_analytics_controller';
import { ServerCommunitiesController } from '../server_communities_controller';

export const Errors = {
  NotLoggedIn: 'Not signed in',
  NoCommunityId: 'Must provide community ID',
  ReservedId: 'The id is reserved and cannot be used',
  CantChangeCustomDomain: 'Custom domain change not permitted',
  CustomDomainIsTaken: 'Custom domain is taken by another community',
  CantChangeNetwork: 'Cannot change community network',
  NotAdmin: 'Not an admin',
  NoCommunityFound: 'Community not found',
  InvalidSocialLink: 'Social Link must begin with http(s)://',
  InvalidCustomDomain: 'Custom domain may not include "commonwealth"',
  InvalidSnapshot: 'Snapshot must fit the naming pattern of *.eth or *.xyz',
  SnapshotOnlyOnEthereum:
    'Snapshot data may only be added to chains with Ethereum base',
  InvalidTerms: 'Terms of Service must begin with https://',
  InvalidDefaultPage: 'Default page does not exist',
  InvalidTransactionHash: 'Valid transaction hash required to verify namespace',
};

export type UpdateCommunityOptions = CommunityAttributes & {
  user: UserInstance;
  featuredTopics?: string[];
  snapshot?: string[];
  transactionHash?: string;
};
export type UpdateCommunityResult = CommunityAttributes & {
  snapshot: string[];
  analyticsOptions: TrackOptions;
};

export async function __updateCommunity(
  this: ServerCommunitiesController,
  { user, id, network, ...rest }: UpdateCommunityOptions,
): Promise<UpdateCommunityResult> {
  if (!user) {
    throw new AppError(Errors.NotLoggedIn);
  }
  if (!id) {
    throw new AppError(Errors.NoCommunityId);
  }
  if (id === ALL_COMMUNITIES) {
    throw new AppError(Errors.ReservedId);
  }
  if (network) {
    throw new AppError(Errors.CantChangeNetwork);
  }

  const community = await this.models.Community.findOne({
    where: { id },
    include: [
      {
        model: this.models.ChainNode,
        attributes: ['url', 'eth_chain_id', 'cosmos_chain_id'],
      },
    ],
  });

  if (!community) {
    throw new AppError(Errors.NoCommunityFound);
  }

  const communityAdmins = await user.getAddresses({
    where: {
      community_id: community.id,
      role: 'admin',
    },
  });

  if (!user.isAdmin && communityAdmins.length === 0) {
    throw new AppError(Errors.NotAdmin);
  }

  // TODO: what do we do to select the proper admin to deploy namespace further down?
  const communityAdmin = communityAdmins[0];

  const {
    active,
    icon_url,
    default_symbol,
    type,
    name,
    description,
    social_links,
    hide_projects,
    stages_enabled,
    custom_stages,
    custom_domain,
    default_summary_view,
    default_page,
    has_homepage,
    terms,
    chain_node_id,
    directory_page_enabled,
    directory_page_chain_node_id,
    namespace,
    transactionHash,
  } = rest;

  // Handle single string case and undefined case
  let { snapshot } = rest;
  if (snapshot !== undefined && typeof snapshot === 'string') {
    snapshot = [snapshot];
  } else if (snapshot === undefined) {
    snapshot = [];
  }

  const nonEmptySocialLinks = (social_links || [])?.filter(
    (s) => typeof s === 'string',
  );
  const invalidSocialLinks = nonEmptySocialLinks?.filter(
    (s) => !urlHasValidHTTPPrefix(s || ''),
  );
  if (nonEmptySocialLinks && invalidSocialLinks.length > 0) {
    throw new AppError(`${invalidSocialLinks[0]}: ${Errors.InvalidSocialLink}`);
  } else if (custom_domain && custom_domain.includes('commonwealth')) {
    throw new AppError(Errors.InvalidCustomDomain);
  } else if (
    snapshot.some((snapshot_space) => {
      const lastFour = snapshot_space.slice(snapshot_space.length - 4);
      return (
        snapshot_space !== '' && lastFour !== '.eth' && lastFour !== '.xyz'
      );
    })
  ) {
    throw new AppError(Errors.InvalidSnapshot);
  } else if (snapshot.length > 0 && community.base !== ChainBase.Ethereum) {
    throw new AppError(Errors.SnapshotOnlyOnEthereum);
  } else if (terms && !urlHasValidHTTPPrefix(terms)) {
    throw new AppError(Errors.InvalidTerms);
  }

  const newSpaces = snapshot.filter((space) => {
    return !community.snapshot_spaces.includes(space);
  });
  for (const space of newSpaces) {
    if (!(await checkSnapshotObjectExists('space', space))) {
      throw new AppError(Errors.InvalidSnapshot);
    }
  }

  community.snapshot_spaces = snapshot;

  if (name) community.name = name;
  if (description) community.description = description;
  if (default_symbol) community.default_symbol = default_symbol;
  if (icon_url) community.icon_url = icon_url;
  if (active !== undefined) community.active = active;
  if (type) community.type = type;
  if (nonEmptySocialLinks !== undefined && nonEmptySocialLinks.length >= 0)
    community.social_links = nonEmptySocialLinks;
  if (hide_projects) community.hide_projects = hide_projects;
  if (typeof stages_enabled === 'boolean')
    community.stages_enabled = stages_enabled;
  if (Array.isArray(custom_stages)) {
    community.custom_stages = custom_stages;
  }
  if (typeof terms === 'string') community.terms = terms;
  if (has_homepage === 'true') community.has_homepage = has_homepage;
  if (default_page) {
    if (has_homepage !== 'true') {
      throw new AppError(Errors.InvalidDefaultPage);
    } else {
      community.default_page = default_page;
    }
  }
  if (chain_node_id) {
    community.chain_node_id = chain_node_id;
  }

  let mixpanelEvent: MixpanelCommunityInteractionEvent;
  let communitySelected = null;

  if (community.directory_page_enabled !== directory_page_enabled) {
    mixpanelEvent = directory_page_enabled
      ? MixpanelCommunityInteractionEvent.DIRECTORY_PAGE_ENABLED
      : MixpanelCommunityInteractionEvent.DIRECTORY_PAGE_DISABLED;

    if (directory_page_enabled) {
      // @ts-expect-error StrictNullChecks
      communitySelected = await this.models.Community.findOne({
        where: { chain_node_id: directory_page_chain_node_id! },
      });
    }
  }

  if (directory_page_enabled !== undefined) {
    community.directory_page_enabled = directory_page_enabled;
  }
  if (directory_page_chain_node_id !== undefined) {
    community.directory_page_chain_node_id = directory_page_chain_node_id;
  }
  if (namespace !== undefined) {
    if (!transactionHash) {
      throw new AppError(Errors.InvalidTransactionHash);
    }

    // we only permit the community admin and not the site admin to create namespace
    if (!communityAdmin) {
      throw new AppError(Errors.NotAdmin);
    }

    const namespaceAddress =
      await commonProtocol.newNamespaceValidator.validateNamespace(
        namespace!,
        transactionHash,
        communityAdmin.address,
        community,
      );

    community.namespace = namespace;
    community.namespace_address = namespaceAddress;
  }

  // TODO Graham 3/31/22: Will this potentially lead to undesirable effects if toggle
  // is left un-updated? Is there a better approach?
  community.default_summary_view = default_summary_view || false;

  // Only permit site admins to update custom domain field on communities, as it requires
  // external configuration (via heroku + whitelists).
  // Currently does not permit unsetting the custom domain; must be done manually.
  if (user.isAdmin && custom_domain) {
    // verify if this custom domain is taken by another community
    const foundCommunity = await this.models.Community.findOne({
      where: { custom_domain: custom_domain! },
    });
    if (foundCommunity) {
      throw new AppError(Errors.CustomDomainIsTaken);
    }

    community.custom_domain = custom_domain;
  } else if (custom_domain && custom_domain !== community.custom_domain) {
    throw new AppError(Errors.CantChangeCustomDomain);
  }

  await community.save();

  // Suggested solution for serializing BigInts
  // https://github.com/GoogleChromeLabs/jsbi/issues/30#issuecomment-1006086291
  (BigInt.prototype as any).toJSON = function () {
    return this.toString();
  };

  const analyticsOptions = {
    // @ts-expect-error StrictNullChecks
    event: mixpanelEvent,
    community: community.id,
    userId: user.id,
    isCustomDomain: null,
    // @ts-expect-error StrictNullChecks
    ...(communitySelected && { communitySelected: communitySelected.id }),
  };

  return { ...community.toJSON(), snapshot, analyticsOptions };
}
