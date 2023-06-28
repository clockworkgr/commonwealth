import { StatsDController } from 'common-common/src/statsd';
import { ChainBase, ChainType } from 'common-common/src/types';
import Sequelize, { QueryTypes } from 'sequelize';
import type {
  IChainEventNotificationData,
  ICommunityNotificationData,
  IPostNotificationData,
  SnapshotEventType,
  SnapshotNotification,
} from 'types';
import { SERVER_URL } from '../../config';
import type { DB } from '../../models';
import type { NotificationInstance } from '../../models/notification';
import {
  createImmediateNotificationEmailObject,
  sendImmediateNotificationEmail,
} from '../../scripts/emails';
import type { WebhookContent } from '../../webhookNotifier';
import send from '../../webhookNotifier';
import { factory, formatFilename } from 'common-common/src/logging';

const log = factory.getLogger(formatFilename(__filename));

const { Op } = Sequelize;

export type NotificationDataTypes =
  | IPostNotificationData
  | ICommunityNotificationData
  | (SnapshotNotification & { eventType: SnapshotEventType });

export default async function emitNotifications(
  models: DB,
  category_id: string,
  object_id: string,
  notification_data: NotificationDataTypes,
  webhook_data?: Partial<WebhookContent>,
  excludeAddresses?: string[],
  includeAddresses?: string[]
): Promise<NotificationInstance> {
  // get subscribers to send notifications to
  StatsDController.get().increment('cw.notifications.created', {
    category_id,
    object_id,
    chain:
      (notification_data as any).chain || (notification_data as any).chain_id,
  });
  const findOptions: any = {
    [Op.and]: [{ category_id }, { object_id }, { is_active: true }],
  };

  // retrieve distinct user ids given a set of addresses
  const fetchUsersFromAddresses = async (
    addresses: string[]
  ): Promise<number[]> => {
    // fetch user ids from address models
    const addressModels = await models.Address.findAll({
      where: {
        address: {
          [Op.in]: addresses,
        },
      },
    });
    if (addressModels && addressModels.length > 0) {
      const userIds = addressModels.map((a) => a.user_id);

      // remove duplicates
      const userIdsDedup = userIds.filter((a, b) => userIds.indexOf(a) === b);
      return userIdsDedup;
    } else {
      return [];
    }
  };

  // currently excludes override includes, but we may want to provide the option for both
  if (excludeAddresses && excludeAddresses.length > 0) {
    const ids = await fetchUsersFromAddresses(excludeAddresses);
    if (ids && ids.length > 0) {
      findOptions[Op.and].push({ subscriber_id: { [Op.notIn]: ids } });
    }
  } else if (includeAddresses && includeAddresses.length > 0) {
    const ids = await fetchUsersFromAddresses(includeAddresses);
    if (ids && ids.length > 0) {
      findOptions[Op.and].push({ subscriber_id: { [Op.in]: ids } });
    }
  }

  // get all relevant subscriptions
  const subscriptions = await models.Subscription.findAll({
    where: findOptions,
    include: models.User,
  });

  // get notification if it already exists
  let notification: NotificationInstance;
  notification = await models.Notification.findOne({
    where: {
      notification_data: JSON.stringify(notification_data),
    },
  });

  // if the notification does not yet exist create it here
  if (!notification) {
    notification = await models.Notification.create({
      notification_data: JSON.stringify(notification_data),
      category_id,
      chain_id:
        (<IPostNotificationData>notification_data).chain_id ||
        (<ICommunityNotificationData>notification_data).chain,
      thread_id:
        Number((<IPostNotificationData>notification_data).thread_id) ||
        undefined,
    });
  }

  let msg;
  try {
    if (category_id !== 'snapshot-proposal') {
      msg = await createImmediateNotificationEmailObject(
        notification_data,
        category_id,
        models
      );
    }
  } catch (e) {
    console.log('Error generating immediate notification email!');
    console.trace(e);
  }

  // send emails
  for (const subscription of subscriptions) {
    if (msg && subscription?.immediate_email && subscription?.User) {
      // kick off async call and immediately return
      sendImmediateNotificationEmail(subscription.User, msg);
    }
  }

  // send data to relevant webhooks
  if (webhook_data) {
    await send(models, {
      notificationCategory: category_id,
      ...(webhook_data as Required<WebhookContent>),
    });
  }

  return notification;
}
