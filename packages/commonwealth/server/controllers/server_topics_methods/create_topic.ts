import { AppError } from '../../../../common-common/src/errors';
import { MixpanelCommunityInteractionEvent } from '../../../shared/analytics/types';
import { CommunityInstance } from '../../models/community';
import { TopicAttributes } from '../../models/topic';
import { UserInstance } from '../../models/user';
import { validateOwner } from '../../util/validateOwner';
import { TrackOptions } from '../server_analytics_methods/track';
import { ServerTopicsController } from '../server_topics_controller';

export const Errors = {
  NotLoggedIn: 'Not signed in',
  TopicRequired: 'Topic name required',
  MustBeAdmin: 'Must be an admin',
  InvalidTokenThreshold: 'Invalid token threshold',
  DefaultTemplateRequired: 'Default Template required',
  InvalidTopicName: 'Topic uses disallowed special characters',
};

export type CreateTopicOptions = {
  user: UserInstance;
  community: CommunityInstance;
  body: Partial<TopicAttributes>;
};

export type CreateTopicResult = [TopicAttributes, TrackOptions];

export async function __createTopic(
  this: ServerTopicsController,
  { user, community, body }: CreateTopicOptions,
): Promise<CreateTopicResult> {
  if (!user) {
    throw new AppError(Errors.NotLoggedIn);
  }

  const name = body.name.trim();
  if (!name) {
    throw new AppError(Errors.TopicRequired);
  }
  if (body.name.match(/["<>%{}|\\/^`]/g)) {
    throw new AppError(Errors.InvalidTopicName);
  }

  const featured_in_sidebar = body.featured_in_sidebar;
  const featured_in_new_post = body.featured_in_new_post;
  const default_offchain_template = body.default_offchain_template?.trim();
  if (featured_in_new_post && !default_offchain_template) {
    throw new AppError(Errors.DefaultTemplateRequired);
  }

  const isAdmin = validateOwner({
    models: this.models,
    user,
    communityId: community.id,
    allowMod: true,
    allowAdmin: true,
    allowGodMode: true,
  });

  if (!isAdmin) {
    throw new AppError(Errors.MustBeAdmin);
  }

  const isNumber = /^\d+$/.test(body.token_threshold);
  if (!isNumber) {
    throw new AppError(Errors.InvalidTokenThreshold);
  }

  const options: Partial<TopicAttributes> = {
    name,
    description: body.description || '',
    token_threshold: body.token_threshold,
    featured_in_sidebar,
    featured_in_new_post,
    default_offchain_template: default_offchain_template || '',
    chain_id: community.id,
  };

  const [newTopic] = await this.models.Topic.findOrCreate({
    where: {
      name,
      chain_id: community.id,
    },
    defaults: options,
  });

  const analyticsOptions = {
    event: MixpanelCommunityInteractionEvent.CREATE_TOPIC,
    community: community.id,
    userId: user.id,
    isCustomDomain: null,
  };

  return [newTopic.toJSON(), analyticsOptions];
}
