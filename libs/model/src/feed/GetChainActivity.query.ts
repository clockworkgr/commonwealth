import { Query } from '@hicommonwealth/core';
import * as schemas from '@hicommonwealth/schemas';
import { NotificationCategories } from '@hicommonwealth/shared';
import { models } from '../database';

export function GetChainActivity(): Query<typeof schemas.ChainFeed> {
  return {
    ...schemas.ChainFeed,
    auth: [],
    secure: false,
    body: async () => {
      const ceNotifs = await models.Notification.findAll({
        where: {
          category_id: NotificationCategories.ChainEvent,
        },
        limit: 50,
        order: [['created_at', 'DESC']],
      });

      return ceNotifs.map(
        (n) => JSON.parse(n.toJSON()['notification_data']),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ) as any;
    },
  };
}
