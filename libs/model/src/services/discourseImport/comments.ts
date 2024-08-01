import {
  CWAddressWithDiscourseId,
  CWThreadWithDiscourseId,
  models,
} from '@hicommonwealth/model';
import { Comment } from '@hicommonwealth/schemas';
import lo from 'lodash';
import moment from 'moment';
import { QueryTypes, Sequelize, Transaction } from 'sequelize';
import { z } from 'zod';

export type CWCommentWithDiscourseId = z.infer<typeof Comment> & {
  discoursePostId: number;
  discoursePostNumber: number;
};

// Discourse Post == CW Comment
type DiscoursePost = {
  id: any;
  post_number: number;
  user_id: any;
  reply_to_post_number: number;
  cooked: any;
  reply_count: number;
  topic_id: number;
  like_count: number;
  created_at: string;
  updated_at: string;
};

class DiscourseQueries {
  static fetchPosts = async (session: Sequelize) => {
    return session.query<DiscoursePost>(
      `
        select posts.id, post_number, posts.user_id, reply_to_post_number, cooked, posts.reply_count,
        posts.topic_id, posts.like_count, posts.created_at, posts.updated_at
        from posts
        inner join topics on topics.id = posts.topic_id
        where posts.deleted_at is null
        and topics.deleted_at is null
        and category_id is not null
        and posts.user_id > 0
        and topics.user_id > 0
        order by posts.created_at
    `,
      { raw: true, type: QueryTypes.SELECT },
    );
  };
}

class CWQueries {
  static createOrFindComment = async (
    discoursePost: DiscoursePost,
    parentCommentId: number | null,
    communityId: string,
    threadId: number,
    addressId: number,
    { transaction }: { transaction: Transaction },
  ): Promise<CWCommentWithDiscourseId> => {
    const options: z.infer<typeof Comment> = {
      community_id: communityId,
      parent_id: `${parentCommentId}`,
      address_id: addressId,
      plaintext: discoursePost.cooked.replace(/'/g, "''"),
      canvas_signed_data: '',
      canvas_hash: '',
      reaction_count: discoursePost.like_count,
      thread_id: threadId,
      text: encodeURIComponent(discoursePost.cooked.replace(/'/g, "''")),
      created_at: moment(discoursePost.created_at).toDate(),
      updated_at: moment(discoursePost.updated_at).toDate(),
    };
    const [comment] = await models.Comment.findOrCreate({
      where: options,
      defaults: options,
      transaction,
    });
    return {
      ...comment.get({ plain: true }),
      discoursePostId: discoursePost.id,
      discoursePostNumber: discoursePost.post_number,
    };
    // const [createdComment] = await models.sequelize.query<{
    //   id: number;
    //   communityId: string;
    //   parent_id: number;
    //   address_id: string;
    //   text: string;
    //   created_at: string;
    //   updated_at: string;
    //   deleted_at: string;
    //   version_history: any[];
    //   root_id: any;
    //   plaintext: string;
    //   _search: string;
    // }>(
    //   `
    //     INSERT INTO "Comments"(
    //     id, community_id, parent_id, address_id, text, created_at, updated_at, deleted_at,
    //     version_history, plaintext, _search, thread_id)
    //     VALUES (
    //     default,
    //     '${communityId}',
    //     ${parentId || null},
    //     ${addressId},
    //     '${encodeURIComponent(text.replace(/'/g, "''"))}',
    //    '${moment(created_at).format('YYYY-MM-DD HH:mm:ss')}',
    //    '${moment(updated_at).format('YYYY-MM-DD HH:mm:ss')}',
    //     null,
    //     '{}',
    //     '${text.replace(/'/g, "''")}',
    //     null, '${cwThreadId}') RETURNING id;
    // `,
    //   { type: QueryTypes.SELECT, transaction },
    // );
    // return {
    //   createdComment,
    //   discoursePostId,
    //   post_number,
    //   cwThreadId,
    //   like_count,
    // };
  };
}

export const createAllCommentsInCW = async (
  discourseConnection: Sequelize,
  {
    communityId,
    addresses,
    threads,
  }: {
    communityId: string;
    addresses: Array<CWAddressWithDiscourseId>;
    threads: Array<CWThreadWithDiscourseId>;
  },
  { transaction }: { transaction: Transaction },
): Promise<Array<CWCommentWithDiscourseId>> => {
  const discoursePosts = await DiscourseQueries.fetchPosts(discourseConnection);
  const postsGroupedByTopic: Record<number, Array<DiscoursePost>> = lo.groupBy(
    discoursePosts,
    ({ topic_id: discourseTopicId }) => discourseTopicId,
  );
  const createdComments: Array<CWCommentWithDiscourseId> = [];

  // iterate over each topic (CW thread)
  for (const [discourseTopicId, posts] of Object.entries(postsGroupedByTopic)) {
    const sortedPosts = lo.sortBy(posts, ({ post_number }) => post_number);
    const { id: cwThreadId } =
      threads.find(
        (thread) => `${thread.discourseTopicId}` === `${discourseTopicId}`,
      ) || {};

    // iterate over each post (CW comment)
    for (const post of sortedPosts) {
      const {
        id: discoursePostId,
        post_number: discoursePostNumber,
        user_id: discoursePostUserId,
        reply_to_post_number: discoursePostReplyToPostNumber,
      } = post;

      if (discoursePostNumber <= 0) {
        continue;
      }

      const { id: addressId } =
        addresses.find(
          ({ discourseUserId }) => discourseUserId === discoursePostUserId,
        ) || {};

      const { id: parentCommentId } =
        createdComments.find(
          (oldComment) =>
            discoursePostId === oldComment.discoursePostId && // is this thread
            discoursePostReplyToPostNumber === oldComment.discoursePostNumber, // is reply to old comment
        ) || {};

      const parentId =
        parentCommentId &&
        discoursePostReplyToPostNumber > 1 &&
        discoursePostNumber - 1 > discoursePostReplyToPostNumber
          ? parentCommentId
          : null;
      if (!addressId) {
        throw new Error(
          `Error: Address not found for user ${discoursePostUserId}`,
        );
      }
      if (!cwThreadId) {
        throw new Error(
          `Error: Thread ID not found for discourse post ${discoursePostId}`,
        );
      }
      const createdComment = await CWQueries.createOrFindComment(
        post,
        parentId,
        communityId,
        cwThreadId,
        addressId,
        { transaction },
      );
      createdComments.push(createdComment);
    }
  }
  return createdComments;
};
