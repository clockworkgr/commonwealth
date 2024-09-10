import {
  Actor,
  INVALID_ACTOR_ERROR,
  InvalidActor,
  InvalidInput,
  type Context,
  type Handler,
} from '@hicommonwealth/core';
import { Group, GroupPermissionAction } from '@hicommonwealth/schemas';
import { Role } from '@hicommonwealth/shared';
import { Op, QueryTypes } from 'sequelize';
import { ZodSchema, z } from 'zod';
import { models } from '../database';
import type {
  AddressInstance,
  CommentInstance,
  ThreadInstance,
  TopicInstance,
} from '../models';

export type AuthContext = {
  address: AddressInstance | null;
  community_id?: string | null;
  topic_id?: number | null;
  thread_id?: number | null;
  comment_id?: number | null;
  topic?: TopicInstance | null;
  thread?: ThreadInstance | null;
  comment?: CommentInstance | null;
  author_address_id?: number;
  is_author?: boolean;
};

export type AuthHandler<Input extends ZodSchema = ZodSchema> = Handler<
  Input,
  ZodSchema,
  AuthContext
>;

export class BannedActor extends InvalidActor {
  constructor(public actor: Actor) {
    super(actor, 'Banned User');
    this.name = INVALID_ACTOR_ERROR;
  }
}

export class NonMember extends InvalidActor {
  constructor(
    public actor: Actor,
    public topic: string,
    public action: GroupPermissionAction,
  ) {
    super(
      actor,
      `User does not have permission to perform action ${action} in topic ${topic}`,
    );
    this.name = INVALID_ACTOR_ERROR;
  }
}

export class RejectedMember extends InvalidActor {
  constructor(
    public actor: Actor,
    public reasons: string[],
  ) {
    super(actor, reasons.join(', '));
    this.name = INVALID_ACTOR_ERROR;
  }
}

/**
 * Prepares authorization context
 *
 * @param actor command actor
 * @param payload command payload
 * @param auth authorization context
 * @param roles roles filter
 */
async function authorizeAddress(
  ctx: Context<ZodSchema, AuthContext>,
  roles: Role[],
): Promise<AuthContext> {
  const { actor, payload } = ctx;
  if (!actor.address)
    throw new InvalidActor(ctx.actor, 'Must provide an address');

  /*
   * Address authorization conventions: => TODO: keep developing this pattern and encapsulate
   *
   * The idea is that authorized requests must include an entity id that can be mapped to
   * a community (community_id), and optionally a topic (topic_id) for gating auth middleware.
   *
   * TODO: More efficient to just context cache the loaded entities right here
   * instead of just adding (caching) the ids in the payload (add to actor?)
   *
   * TODO: Find ways to cache() by args to avoid db trips
   *
   * 1. Find by community_id when payload contains community_id or id
   * 2. Find by thread_id when payload contains thread_id
   * 3. Find by comment_id when payload contains comment_id
   */
  const auth: AuthContext = { address: null };
  (ctx as { auth: AuthContext }).auth = auth;

  auth.community_id =
    ('community_id' in payload && payload.community_id) || payload.id;
  auth.topic_id = 'topic_id' in payload && payload.topic_id;
  if (!auth.community_id) {
    auth.thread_id = 'thread_id' in payload && payload.thread_id;
    if (!auth.thread_id) {
      auth.comment_id = 'comment_id' in payload && payload.comment_id;
      if (!auth.comment_id)
        throw new InvalidInput('Must provide community, thread, or comment id');
      auth.comment = await models.Comment.findOne({
        where: { id: auth.comment_id },
        include: [
          {
            model: models.Thread,
            required: true,
          },
        ],
      });
      if (!auth.comment)
        throw new InvalidInput('Must provide a valid comment id');
      auth.community_id = auth.comment.Thread!.community_id;
      auth.topic_id = auth.comment.Thread!.topic_id;
      auth.author_address_id = auth.comment.address_id;
    } else {
      auth.thread = await models.Thread.findOne({
        where: { id: auth.thread_id },
      });
      if (!auth.thread)
        throw new InvalidInput('Must provide a valid thread id');
      auth.community_id = auth.thread.community_id;
      auth.topic_id = auth.thread.topic_id;
      auth.author_address_id = auth.thread.address_id;
    }
  }
  auth.address = await models.Address.findOne({
    where: {
      user_id: actor.user.id,
      address: actor.address,
      community_id: auth.community_id,
      role: { [Op.in]: roles },
    },
    order: [['role', 'DESC']],
  });
  if (!auth.address)
    throw new InvalidActor(actor, `User is not ${roles} in the community`);
  return auth;
}

/**
 * Checks if actor passes a set of requirements and grants access for all groups of the given topic
 */
async function isTopicMember(
  actor: Actor,
  auth: AuthContext,
  action: GroupPermissionAction,
): Promise<void> {
  if (!auth.topic_id) throw new InvalidInput('Must provide a topic id');

  auth.topic = await models.Topic.findOne({ where: { id: auth.topic_id } });
  if (!auth.topic) throw new InvalidInput('Topic not found');

  if (auth.topic.group_ids?.length === 0) return;

  const groups = await models.sequelize.query<
    z.infer<typeof Group> & {
      allowed_actions?: GroupPermissionAction[];
    }
  >(
    `
    SELECT g.*, gp.allowed_actions
    FROM "Groups" as g 
    LEFT JOIN "GroupPermissions" gp ON g.id = gp.group_id
    WHERE g.community_id = :community_id AND g.id IN (:group_ids);
    `,
    {
      type: QueryTypes.SELECT,
      raw: true,
      replacements: {
        community_id: auth.topic.community_id,
        group_ids: auth.topic.group_ids,
      },
    },
  );

  // There are 2 cases here. We either have the old group permission system where the group doesn't have
  // any allowed_actions, or we have the new fine-grained permission system where the action must be in
  // the allowed_actions list.
  const allowed = groups.filter(
    (g) => !g.allowed_actions || g.allowed_actions.includes(action),
  );
  if (!allowed.length!) throw new NonMember(actor, auth.topic.name, action);

  // check membership for all groups of topic
  const memberships = await models.Membership.findAll({
    where: {
      group_id: { [Op.in]: allowed.map((g) => g.id!) },
      address_id: auth.address!.id,
    },
    include: [
      {
        model: models.Group,
        as: 'group',
      },
    ],
  });
  if (!memberships.length) throw new NonMember(actor, auth.topic.name, action);

  const rejects = memberships.filter((m) => m.reject_reason);
  if (rejects.length === memberships.length)
    throw new RejectedMember(
      actor,
      rejects.flatMap((reject) =>
        reject.reject_reason!.map((reason) => reason.message),
      ),
    );
}

//  MIDDLEWARE
export const isSuperAdmin: AuthHandler = async (ctx) => {
  if (!ctx.actor.user.isAdmin)
    await Promise.reject(new InvalidActor(ctx.actor, 'Must be a super admin'));
};

/**
 * Validates if actor address is authorized by checking for:
 * - **super admin**: Allow all operations when the user is a super admin (god mode)
 * - **in roles**: Allow when user is in the provides community roles
 * - **not banned**: Reject if user is banned
 * - **author**: Allow when the user is the creator of the entity
 * - **topic group**: Allow when user has group permissions in topic
 *
 * @param roles specific community roles - all by default
 * @param action specific group permission action
 * @throws InvalidActor when not authorized
 */
export function isAuthorized({
  roles = ['admin', 'moderator', 'member'],
  action,
}: {
  roles?: Role[];
  action?: GroupPermissionAction;
}): AuthHandler {
  return async (ctx) => {
    if (ctx.actor.user.isAdmin) return;
    const auth = await authorizeAddress(ctx, roles);
    if (auth.address!.is_banned) throw new BannedActor(ctx.actor);
    if (auth.author_address_id && auth.address!.id === auth.author_address_id)
      return; // author
    if (action && auth.address!.role === 'member')
      await isTopicMember(ctx.actor, auth, action);
  };
}
