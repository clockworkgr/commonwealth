import { PG_INT } from '@hicommonwealth/schemas';
import z from 'zod';
import { EventNames } from './events';
import * as events from './events.schemas';

const BaseOutboxProperties = z.object({
  event_id: PG_INT.optional(),
  relayed: z.boolean().optional(),
  created_at: z.coerce.date().optional(),
  updated_at: z.coerce.date().optional(),
});

export const Outbox = z.union([
  z
    .object({
      event_name: z.literal(EventNames.ThreadCreated),
      event_payload: events.ThreadCreated,
    })
    .merge(BaseOutboxProperties),
  z
    .object({
      event_name: z.literal(EventNames.CommentCreated),
      event_payload: events.CommentCreated,
    })
    .merge(BaseOutboxProperties),
  z
    .object({
      event_name: z.literal(EventNames.GroupCreated),
      event_payload: events.GroupCreated,
    })
    .merge(BaseOutboxProperties),
  z
    .object({
      event_name: z.literal(EventNames.CommunityCreated),
      event_payload: events.CommunityCreated,
    })
    .merge(BaseOutboxProperties),
  z
    .object({
      event_name: z.literal(EventNames.SnapshotProposalCreated),
      event_payload: events.SnapshotProposalCreated,
    })
    .merge(BaseOutboxProperties),
  z
    .object({
      event_name: z.literal(EventNames.ThreadUpvoted),
      event_payload: events.ThreadUpvoted,
    })
    .merge(BaseOutboxProperties),
  z
    .object({
      event_name: z.literal(EventNames.DiscordMessageCreated),
      event_payload: events.DiscordMessageCreated,
    })
    .merge(BaseOutboxProperties),
  z
    .object({
      event_name: z.literal(EventNames.ChainEventCreated),
      event_payload: events.ChainEventCreated,
    })
    .merge(BaseOutboxProperties),
  z
    .object({
      event_name: z.literal(EventNames.UserMentioned),
      event_payload: events.UserMentioned,
    })
    .merge(BaseOutboxProperties),
  z
    .object({
      event_name: z.literal(EventNames.RecurringContestManagerDeployed),
      event_payload: events.RecurringContestManagerDeployed,
    })
    .merge(BaseOutboxProperties),
  z
    .object({
      event_name: z.literal(EventNames.OneOffContestManagerDeployed),
      event_payload: events.OneOffContestManagerDeployed,
    })
    .merge(BaseOutboxProperties),
  z
    .object({
      event_name: z.literal(EventNames.ContestStarted),
      event_payload: events.ContestStarted,
    })
    .merge(BaseOutboxProperties),
  z
    .object({
      event_name: z.literal(EventNames.ContestContentAdded),
      event_payload: events.ContestContentAdded,
    })
    .merge(BaseOutboxProperties),
  z
    .object({
      event_name: z.literal(EventNames.ContestContentUpvoted),
      event_payload: events.ContestContentUpvoted,
    })
    .merge(BaseOutboxProperties),
  z
    .object({
      event_name: z.literal(EventNames.SubscriptionPreferencesUpdated),
      event_payload: events.SubscriptionPreferencesUpdated,
    })
    .merge(BaseOutboxProperties),
]);
