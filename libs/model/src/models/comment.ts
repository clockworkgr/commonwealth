import { EventNames, stats } from '@hicommonwealth/core';
import { Comment } from '@hicommonwealth/schemas';
import Sequelize from 'sequelize';
import { z } from 'zod';
import type {
  CommentSubscriptionAttributes,
  ModelInstance,
  ReactionAttributes,
  ThreadInstance,
} from '.';
import { emitEvent } from '../utils';

export type CommentAttributes = z.infer<typeof Comment> & {
  // associations
  reactions?: ReactionAttributes[];
  subscriptions?: CommentSubscriptionAttributes[];
};

export type CommentInstance = ModelInstance<CommentAttributes>;

export default (
  sequelize: Sequelize.Sequelize,
): Sequelize.ModelStatic<CommentInstance> =>
  sequelize.define<CommentInstance>(
    'Comment',
    {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      thread_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Threads',
          key: 'id',
        },
      },
      parent_id: { type: Sequelize.STRING, allowNull: true },
      address_id: { type: Sequelize.INTEGER, allowNull: true },
      created_by: { type: Sequelize.STRING, allowNull: true },
      text: { type: Sequelize.TEXT, allowNull: false },
      plaintext: { type: Sequelize.TEXT, allowNull: true },
      version_history: {
        type: Sequelize.ARRAY(Sequelize.TEXT),
        defaultValue: [],
        allowNull: false,
      },

      // canvas-related columns
      canvas_signed_data: { type: Sequelize.JSONB, allowNull: true },
      canvas_hash: { type: Sequelize.STRING, allowNull: true },

      // timestamps
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
      deleted_at: { type: Sequelize.DATE, allowNull: true },
      marked_as_spam_at: { type: Sequelize.DATE, allowNull: true },
      discord_meta: { type: Sequelize.JSONB, allowNull: true },

      //counts
      reaction_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      reaction_weights_sum: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      version_history_updated: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      hooks: {
        afterCreate: async (comment, options) => {
          const [, threads] = await (
            sequelize.models.Thread as Sequelize.ModelStatic<ThreadInstance>
          ).update(
            {
              comment_count: Sequelize.literal('comment_count + 1'),
              activity_rank_date: comment.created_at,
            },
            {
              where: { id: comment.thread_id },
              returning: true,
              transaction: options.transaction,
            },
          );
          await emitEvent(
            sequelize.models.Outbox,
            [
              {
                event_name: EventNames.CommentCreated,
                event_payload: {
                  ...comment.toJSON(),
                  community_id: threads.at(0)!.community_id,
                },
              },
            ],
            options.transaction,
          );
          stats().increment('cw.hook.comment-count', {
            thread_id: String(comment.thread_id),
          });
        },

        afterDestroy: async ({ thread_id }, options) => {
          await (
            sequelize.models.Thread as Sequelize.ModelStatic<ThreadInstance>
          ).update(
            {
              comment_count: Sequelize.literal('comment_count - 1'),
            },
            {
              where: { id: thread_id },
              transaction: options.transaction,
            },
          );
          stats().decrement('cw.hook.comment-count', {
            thread_id: String(thread_id),
          });
        },
      },
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at',
      tableName: 'Comments',
      underscored: true,
      paranoid: true,
      indexes: [
        { fields: ['id'] },
        { fields: ['address_id'] },
        { fields: ['created_at'] },
        { fields: ['updated_at'] },
        { fields: ['thread_id'] },
      ],
    },
  );
