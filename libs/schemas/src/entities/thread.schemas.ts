import { z } from 'zod';
import { DiscordMetaSchema, linksSchema, PG_INT } from '../utils';
import { Topic } from './topic.schemas';
import { Address } from './user.schemas';

export const Thread = z.object({
  id: PG_INT.optional(),
  address_id: PG_INT,
  title: z.string(),
  kind: z.string(),
  stage: z.string(),
  body: z.string().nullish(),
  plaintext: z.string().nullish(),
  url: z.string().nullish(),
  topic_id: PG_INT.nullish(),
  pinned: z.boolean().nullish(),
  community_id: z.string(),
  view_count: PG_INT,
  links: z.object(linksSchema).array().nullish(),

  read_only: z.boolean().nullish(),
  version_history: z.array(z.string()).nullish(),

  has_poll: z.boolean().nullish(),

  canvas_signed_data: z.string().nullish(),
  canvas_hash: z.string().nullish(),

  created_at: z.coerce.date().optional(),
  updated_at: z.coerce.date().optional(),
  last_edited: z.coerce.date().nullish(),
  deleted_at: z.coerce.date().nullish(),
  last_commented_on: z.coerce.date().nullish(),
  marked_as_spam_at: z.coerce.date().nullish(),
  archived_at: z.coerce.date().nullish(),
  locked_at: z.coerce.date().nullish(),
  discord_meta: DiscordMetaSchema.nullish(),

  //counts
  reaction_count: PG_INT,
  reaction_weights_sum: PG_INT,
  comment_count: PG_INT,

  activity_rank_date: z.coerce.date().nullish(),

  //notifications
  max_notif_id: PG_INT,

  created_by: z.string().nullish(),
  profile_name: z.string().nullish(),

  // associations
  Address: Address.nullish(),
  topic: Topic.nullish(),
});

export const ThreadVersionHistory = z.object({
  id: PG_INT.optional(),
  thread_id: PG_INT,
  address: z
    .string()
    .describe('Address of the creator of the post or the collaborator'),
  body: z.string(),
  timestamp: z.date(),
});
