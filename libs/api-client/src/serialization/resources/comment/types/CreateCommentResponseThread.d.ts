/**
 * This file was auto-generated by Fern from our API Definition.
 */
import * as CommonApi from '../../../../api/index';
import * as core from '../../../../core';
import * as serializers from '../../../index';
import { CreateCommentResponseThreadAddress } from './CreateCommentResponseThreadAddress';
import { CreateCommentResponseThreadCollaboratorsItem } from './CreateCommentResponseThreadCollaboratorsItem';
import { CreateCommentResponseThreadDiscordMeta } from './CreateCommentResponseThreadDiscordMeta';
import { CreateCommentResponseThreadLinksItem } from './CreateCommentResponseThreadLinksItem';
import { CreateCommentResponseThreadReactionsItem } from './CreateCommentResponseThreadReactionsItem';
import { CreateCommentResponseThreadSearch } from './CreateCommentResponseThreadSearch';
import { CreateCommentResponseThreadThreadVersionHistoriesItem } from './CreateCommentResponseThreadThreadVersionHistoriesItem';
import { CreateCommentResponseThreadTopic } from './CreateCommentResponseThreadTopic';
export declare const CreateCommentResponseThread: core.serialization.ObjectSchema<
  serializers.CreateCommentResponseThread.Raw,
  CommonApi.CreateCommentResponseThread
>;
export declare namespace CreateCommentResponseThread {
  interface Raw {
    id?: number | null;
    address_id: number;
    title: string;
    kind: string;
    stage?: string | null;
    body?: string | null;
    url?: string | null;
    topic_id?: number | null;
    pinned?: boolean | null;
    community_id: string;
    view_count?: number | null;
    links?: CreateCommentResponseThreadLinksItem.Raw[] | null;
    content_url?: string | null;
    read_only?: boolean | null;
    has_poll?: boolean | null;
    canvas_signed_data?: string | null;
    canvas_msg_id?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
    last_edited?: string | null;
    deleted_at?: string | null;
    last_commented_on?: string | null;
    marked_as_spam_at?: string | null;
    archived_at?: string | null;
    locked_at?: string | null;
    discord_meta?: CreateCommentResponseThreadDiscordMeta.Raw | null;
    reaction_count?: number | null;
    reaction_weights_sum?: number | null;
    comment_count?: number | null;
    activity_rank_date?: string | null;
    created_by?: string | null;
    profile_name?: string | null;
    search: CreateCommentResponseThreadSearch.Raw;
    Address?: CreateCommentResponseThreadAddress.Raw | null;
    topic?: CreateCommentResponseThreadTopic.Raw | null;
    collaborators?: CreateCommentResponseThreadCollaboratorsItem.Raw[] | null;
    reactions?: CreateCommentResponseThreadReactionsItem.Raw[] | null;
    ThreadVersionHistories?:
      | CreateCommentResponseThreadThreadVersionHistoriesItem.Raw[]
      | null;
  }
}
