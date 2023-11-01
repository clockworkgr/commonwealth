import * as dotenv from 'dotenv';
dotenv.config();

export const RABBITMQ_URI = (() => {
  if (!process.env.CLOUDAMQP_URL || process.env.NODE_ENV === 'development') {
    if (
      process.env.VULTR_RABBITMQ_CONTAINER_PORT &&
      process.env.VULTR_RABBITMQ_MANAGEMENT_CONTAINER_PORT
    ) {
      return `amqp://guest:guest@${process.env.VULTR_IP}:${process.env.VULTR_RABBITMQ_CONTAINER_PORT}`;
    } else return 'amqp://localhost';
  } else return process.env.CLOUDAMQP_URL;
})();

export const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

export const SERVER_URL = process.env.SERVER_URL || 'http://localhost:8080';

export const CW_BOT_KEY = process.env.CW_BOT_KEY;

export const ROLLBAR_ENV = process.env.ROLLBAR_ENV || 'local';

export const ROLLBAR_SERVER_TOKEN = process.env.ROLLBAR_SERVER_TOKEN;
