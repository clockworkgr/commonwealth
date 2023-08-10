import express from 'express';
import axios from 'axios';
import AWS from 'aws-sdk';
import {
  RabbitMQController,
  getRabbitMQConfig,
} from 'common-common/src/rabbitmq';
import { RascalPublications } from 'common-common/src/rabbitmq/types';
import { RABBITMQ_URI } from '../utils/config';
import { factory, formatFilename } from 'common-common/src/logging';
import v8 from 'v8';

const s3 = new AWS.S3();

const S3_BUCKET_NAME = 'assets.commonwealth.im';
const S3_OBJECT_KEY = `${process.env.NODE_ENV}-last-processed-farcaster-cast-uri.txt`;
const BOT_KEYWORD = 'cw123xyz';

const app = express();
const PORT = 3000;

const controller = new RabbitMQController(getRabbitMQConfig(RABBITMQ_URI));
const initPromise = controller.init();

const log = factory.getLogger(formatFilename(__filename));

log.info(
  `Node Option max-old-space-size set to: ${JSON.stringify(
    v8.getHeapStatistics().heap_size_limit / 1000000000
  )} GB`
);

// Helper function to get the URI and timestamp from S3
const getURIFromS3 = async (): Promise<{
  uri: string | null;
  timestamp: number | null;
}> => {
  try {
    const data = await s3
      .getObject({
        Bucket: S3_BUCKET_NAME,
        Key: S3_OBJECT_KEY,
      })
      .promise();

    const contents = data.Body?.toString() || '';
    const [uri, timestampString] = contents.split(',');

    return {
      uri: uri || null,
      timestamp: timestampString ? parseInt(timestampString, 10) : null,
    };
  } catch (error) {
    if (error.code === 'NoSuchKey') {
      log.info(
        'URI and timestamp not found in S3. This might be a cold start.'
      );
      return { uri: null, timestamp: null };
    } else {
      log.error('Failed to fetch the URI and timestamp from S3:', error);
      return { uri: null, timestamp: null };
    }
  }
};

// Helper function to save the URI and timestamp to S3
const saveIDToS3 = async (uri: string): Promise<void> => {
  try {
    const twoMinutesAgo = Math.floor((Date.now() - 120 * 1000) / 1000); // Convert to Unix timestamp
    const dataToSave = `${uri},${twoMinutesAgo}`;

    await s3
      .putObject({
        Bucket: S3_BUCKET_NAME,
        Key: S3_OBJECT_KEY,
        Body: dataToSave,
      })
      .promise();

    log.info('URI and timestamp saved to S3 successfully');
  } catch (error) {
    log.error('Failed to save the URI and timestamp to S3:', error);
  }
};

const fetchData = async () => {
  try {
    const { uri: lastProcessedURI, timestamp: lastFetchedTime } =
      await getURIFromS3();

    let allCasts: any[] = [];
    let pageNo = 0;
    let hasNextPage = true;

    // Pagination loop
    while (hasNextPage) {
      const response = await axios.get(
        `https://searchcaster.xyz/api/search?text=${BOT_KEYWORD}&count=200&page=${pageNo}&after=${lastFetchedTime}`
      );

      const casts = response.data.casts;

      // If the current page of results is empty or has fewer than the maximum number of results,
      // it means there might not be any more pages to fetch
      if (casts.length < 200) {
        hasNextPage = false;
      }

      allCasts = allCasts.concat(casts);
      pageNo++;

      // If we find the lastProcessedURI in the current page, we can stop fetching additional pages
      if (casts.some((cast) => cast.uri === lastProcessedURI)) {
        hasNextPage = false;
      }
    }

    // Now, filter out the casts that should be processed
    const lastIndexProcessed = allCasts.findIndex(
      (cast) => cast.uri === lastProcessedURI
    );
    const castsToProcess =
      lastIndexProcessed === -1
        ? allCasts
        : allCasts.slice(0, lastIndexProcessed);

    if (castsToProcess.length === 0) {
      // No casts to process, change nothing except timestamp
      log.info(
        `No casts to process, nothing published to RabbitMQ, ${new Date()}`
      );
      await saveIDToS3(lastProcessedURI);
      return;
    }

    try {
      await initPromise;
      await controller.publish(
        { casts: castsToProcess, lastURIProcessed: castsToProcess[0]?.uri },
        RascalPublications.FarcasterListener
      );

      // await saveIDToS3(castsToProcess[0]?.uri); TODO: Comment back in when we're done testing
      log.info(`Message published to RabbitMQ`);
    } catch (error) {
      log.info(`Error publishing to rabbitMQ`, error);
    }
  } catch (error) {
    log.error('Error fetching data:', error);
  }
};

// Set up interval to fetch data every 2 minutes (120000 milliseconds)
setInterval(fetchData, 120000);

app.get('/', (req, res) => {
  res.send('Server running...');
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  fetchData(); // Initial call, so you don't have to wait 1 minute for the first request
});
