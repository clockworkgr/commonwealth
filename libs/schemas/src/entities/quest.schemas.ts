import z from 'zod';
import { events } from '../events';
import { PG_INT } from '../utils';

export const QuestEvents = {
  CommunityJoined: events.CommunityJoined,
  ThreadCreated: events.ThreadCreated,
  ThreadUpvoted: events.ThreadUpvoted,
  CommentCreated: events.CommentCreated,
  CommentUpvoted: events.CommentUpvoted,
  UserMentioned: events.UserMentioned,
  //PollCreated: events.PollCreated,
  //ThreadEdited: events.ThreadEdited,
  //CommentEdited: events.CommentEdited,
  //PollEdited: events.PollEdited,
} as const;

export enum QuestParticipationLimit {
  OncePerQuest = 'once_per_quest',
  OncePerPeriod = 'once_per_period',
}

export enum QuestParticipationPeriod {
  Daily = 'daily',
  Weekly = 'weekly',
  Monthly = 'monthly',
}

export const QuestActionMeta = z
  .object({
    id: PG_INT.nullish(),
    quest_id: PG_INT,
    //event names instead of enums for flexibility when adding new events
    event_name: z.enum(
      Object.keys(QuestEvents) as [
        keyof typeof QuestEvents,
        ...Array<keyof typeof QuestEvents>,
      ],
    ),
    reward_amount: z.number(),
    creator_reward_weight: z.number().min(0).max(1).default(0),
    participation_limit: z.nativeEnum(QuestParticipationLimit).optional(),
    participation_period: z.nativeEnum(QuestParticipationPeriod).optional(),
    participation_times_per_period: z.number().optional(),
    created_at: z.coerce.date().optional(),
    updated_at: z.coerce.date().optional(),
  })
  .describe('Quest action metadata associated to a quest instance');

export const QuestScore = z
  .object({
    user_id: PG_INT,
    points: z.number(),
    period: z.nativeEnum(QuestParticipationPeriod).optional(),
  })
  .describe('Value type with user total/period score');

export const Quest = z
  .object({
    id: PG_INT.nullish(),
    community_id: z.string(),
    name: z.string().max(255),
    description: z.string().max(1000),
    start_date: z.coerce.date(),
    end_date: z.coerce.date(),
    created_at: z.coerce.date().optional(),
    updated_at: z.coerce.date().optional(),

    // associations
    action_metas: z.array(QuestActionMeta).optional(),
  })
  .describe(
    'A quest is a collection of actions that users can take to earn rewards',
  );

export const QuestAction = z
  .object({
    user_id: PG_INT.describe('The user who took the action'),
    quest_action_meta_id: PG_INT.describe('The action metadata for the action'),
    created_at: z.coerce.date().optional(),
  })
  .describe('Records user actions in a quest');
