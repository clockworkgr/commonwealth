import { logger, type Command } from '@hicommonwealth/core';
import * as schemas from '@hicommonwealth/schemas';
import { Sequelize } from 'sequelize';
import { URL, fileURLToPath } from 'url';
import { config } from '../config';
import { createDiscourseDBConnection, models } from '../database';
import { isSuperAdmin } from '../middleware';
import {
  createAllAddressesInCW,
  createAllCategoriesInCW,
  createAllCommentsInCW,
  createAllProfilesInCW,
  createAllReactionsInCW,
  createAllSubscriptionsInCW,
  createAllThreadsInCW,
  createAllUsersInCW,
  importDump,
} from '../services/discourseImport';

const __filename = fileURLToPath(import.meta.url);
const log = logger(__filename);

type CleanupFn = {
  description: string;
  fn: () => Promise<void>;
};

export function ImportDiscourseCommunity(): Command<
  typeof schemas.ImportDiscourseCommunity
> {
  return {
    ...schemas.ImportDiscourseCommunity,
    auth: [isSuperAdmin],
    body: async ({ id: communityId, payload }) => {
      // TODO: use global lock to limit concurrency on this command?

      // TODO: implement accountsClaimable
      const { base, dumpUrl } = payload;

      // cleanup functions are pushed to this array, then popped off
      // and invoked after everything is done
      const cleanupStack: CleanupFn[] = [];

      const cwConnection: Sequelize = models.sequelize;
      let restrictedDiscourseConnection: Sequelize | null = null;

      try {
        const now = Date.now();

        const discourseDbName = `temp_discourse_dump_${now}`;
        const restrictedDiscourseDbUser = `temp_discourse_importer_${now}`;
        const restrictedDiscourseDbPass = `temp_discourse_importer_pass_${now}`;

        // create discourse DB user
        await cwConnection.query(
          `CREATE ROLE ${restrictedDiscourseDbUser} WITH LOGIN PASSWORD '${restrictedDiscourseDbPass}';`,
        );
        cleanupStack.push({
          description: 'Drop discourse DB user',
          fn: async () => {
            await cwConnection.query(`DROP ROLE ${restrictedDiscourseDbUser};`);
          },
        });

        // create discourse DB
        await cwConnection.query(`CREATE DATABASE ${discourseDbName};`);
        cleanupStack.push({
          description: 'Drop discourse DB',
          fn: async () => {
            await cwConnection.query(`
            SELECT pg_terminate_backend(pid)
            FROM pg_stat_activity
            WHERE datname = '${discourseDbName}' AND pid <> pg_backend_pid();
          `);
            await cwConnection.query(`DROP DATABASE ${discourseDbName};`);
          },
        });

        // connect to discourse DB as superuser to
        // grant privileges to restricted user
        const superUserDiscourseDbUri = (() => {
          const parsedUrl = new URL(config.DB.URI);
          parsedUrl.pathname = discourseDbName;
          if (config.DB.NO_SSL) {
            parsedUrl.searchParams.set('sslmode', 'disable');
          }
          return parsedUrl.toString();
        })();
        const superUserDiscourseConnection = await createDiscourseDBConnection(
          superUserDiscourseDbUri,
        );
        await superUserDiscourseConnection.query(
          `GRANT ALL ON SCHEMA public TO ${restrictedDiscourseDbUser};`,
        );
        cleanupStack.push({
          description:
            'Disconnect super user from temp discourse DB so it can be dropped',
          fn: async () => {
            await superUserDiscourseConnection.close();
          },
        });

        // create restricted discourse DB URI
        const restrictedDiscourseDbUri = (() => {
          const parsedUrl = new URL(config.DB.URI);
          const host = parsedUrl.host;
          const port = parsedUrl.port || 5432;
          let uri = `postgresql://${restrictedDiscourseDbUser}:${restrictedDiscourseDbPass}@${host}:${port}/${discourseDbName}`;
          if (config.DB.NO_SSL) {
            uri += '?sslmode=disable';
          }
          return uri;
        })();

        // connect to discourse DB
        restrictedDiscourseConnection = await createDiscourseDBConnection(
          restrictedDiscourseDbUri,
        );

        cleanupStack.push({
          description:
            'Disconnect restricted user from temporary discourse DB so it can be dropped',
          fn: async () => {
            await restrictedDiscourseConnection?.close();
          },
        });

        // import dump
        await importDump(dumpUrl, restrictedDiscourseDbUri);
      } catch (err) {
        // on error, cleanup and throw
        log.error('import stage failed: ', err as Error);
        await runCleanup(cleanupStack);
        throw err;
      }

      // sanity check
      if (!restrictedDiscourseConnection) {
        throw new Error('failed to connect to discourse DB');
      }

      const tables: Record<string, any> = {};
      const transaction = await models.sequelize.transaction();
      try {
        // TODO: use accountsClaimable flag

        // insert users
        const { newUsers, existingUsers } = await createAllUsersInCW(
          restrictedDiscourseConnection,
          cwConnection,
          { communityId: communityId! },
          { transaction },
        );
        tables['users'] = newUsers;
        log.debug(`Users: ${newUsers.length}`);

        // insert profiles
        const profiles = await createAllProfilesInCW(
          cwConnection,
          restrictedDiscourseConnection,
          { newUsers },
          { transaction },
        );
        tables['profiles'] = profiles;
        log.debug(`Profiles: ${profiles.length}`);

        // insert addresses
        const addresses = await createAllAddressesInCW(
          restrictedDiscourseConnection,
          cwConnection,
          {
            users: newUsers.concat(...existingUsers),
            profiles,
            communityId: communityId!,
            base,
          },
          { transaction },
        );
        tables['addresses'] = addresses;
        log.debug(`Addresses: ${addresses.length}`);

        // insert categories (topics)
        const categories = await createAllCategoriesInCW(
          restrictedDiscourseConnection,
          cwConnection,
          { communityId: communityId! },
          { transaction },
        );
        tables['categories'] = categories;
        log.debug(`Categories: ${categories.length}`);

        // insert topics (threads)
        const threads = await createAllThreadsInCW(
          restrictedDiscourseConnection,
          cwConnection,
          {
            users: newUsers.concat(existingUsers),
            categories,
            communityId: communityId!,
          },
          { transaction },
        );
        tables['threads'] = threads;
        log.debug(`Threads: ${threads.length}`);

        // insert posts (comments)
        const comments = await createAllCommentsInCW(
          restrictedDiscourseConnection,
          cwConnection,
          { communityId: communityId!, addresses, threads },
          { transaction },
        );
        tables['comments'] = comments;
        log.debug(`Comments: ${comments.length}`);

        // insert reactions
        const reactions = await createAllReactionsInCW(
          restrictedDiscourseConnection,
          cwConnection,
          { addresses, communityId: communityId!, threads, comments },
          { transaction },
        );
        tables['reactions'] = reactions;
        log.debug(`Reactions: ${reactions.length}`);

        // insert subscriptions
        const subscriptions = await createAllSubscriptionsInCW(
          restrictedDiscourseConnection,
          cwConnection,
          {
            communityId: communityId!,
            users: newUsers.concat(existingUsers),
            threads,
          },
          { transaction },
        );
        tables['subscriptions'] = subscriptions;
        log.debug(`Subscriptions: ${subscriptions.length}`);

        await transaction.commit();
        const community = await models.Community.findByPk(communityId);
        return community!.get({ plain: true });
      } catch (err) {
        await transaction.rollback();
        throw err;
      } finally {
        // always cleanup
        await runCleanup(cleanupStack);
      }
    },
  };
}

const runCleanup = async (cleanupStack: CleanupFn[]) => {
  while (cleanupStack.length > 0) {
    const { description, fn } = cleanupStack.pop()!;
    try {
      log.debug(`RUNNING CLEANUP: ${description}`);
      await fn();
    } catch (err) {
      log.error('cleanup failed: ', err as Error);
    }
  }
};
