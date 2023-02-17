import type { Request, Response } from 'express';
import { QueryTypes } from 'sequelize';
import { groupBy } from 'lodash';
import { factory, formatFilename } from 'common-common/src/logging';
import type { DB } from '../models';
import { sequelize } from '../database';

const log = factory.getLogger(formatFilename(__filename));

type UniqueAddresses = {
  thread_id: number;
  address_id: number;
  address: string;
  chain;
};

const fetchUniqueAddressesByRootIds = async (
  models: DB,
  { chain, thread_ids }
) => {
  return sequelize.query<UniqueAddresses>(
    `
    SELECT distinct cts.address_id, address, thread_id, cts.chain
    FROM "Comments" cts INNER JOIN "Addresses" adr
    ON adr.id = cts.address_id
    WHERE thread_id IN ($thread_ids)
    AND cts.chain = $chain
    AND deleted_at IS NULL
    ORDER BY thread_id
  `,
    {
      type: QueryTypes.SELECT,
      bind: {
        thread_ids,
        chain,
      },
    }
  );
};

/*
1) Get the number of distinct users for list of threads(thread_id)
2) Get first 2 avatars for each group of users
3) Get latest comment

TODO: The naming system here, and in the threadUniqueAddressesCount controller,
is wildly unclear and wildly inconsistent. We should standardize + clarify.
 */
const threadsUsersCountAndAvatar = async (
  models: DB,
  req: Request,
  res: Response
) => {
  const { chain, threads = [] } = req.body;
  try {
    if (chain && threads.length) {
      const thread_ids = threads.map(({ thread_id }) => thread_id);
      const uniqueAddressesByRootIds = await fetchUniqueAddressesByRootIds(
        models,
        { chain, thread_ids }
      );
      const uniqueAddressesByThread = groupBy<UniqueAddresses>(
        uniqueAddressesByRootIds,
        ({ thread_id }) => thread_id
      );
      return res.json(
        threads.map(({ thread_id: rootId, author: authorAddress }) => {
          const uniqueAddresses = (
            uniqueAddressesByThread[rootId] || []
          ).filter(({ address }) => address !== authorAddress);
          const addressesCount = uniqueAddresses.length + 1;
          const addresses = uniqueAddresses
            .concat({
              thread_id: rootId,
              address: authorAddress,
              address_id: null,
              chain,
            })
            .slice(0, 2);
          return {
            id: rootId,
            rootId,
            addresses,
            count: addressesCount > 2 ? addressesCount - 2 : 0,
          };
        })
      );
    }
    return res.json([]);
  } catch (e) {
    log.error('Error fetching threads users count and avatar', e);
    console.log(e);
    res.json(e);
  }
};

export default threadsUsersCountAndAvatar;
