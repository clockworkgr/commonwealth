console.log('FIXME: START ' + import.meta.url);

import { configure, config as target } from '@hicommonwealth/core';
import { z } from 'zod';

const DEFAULTS = {
  JWT_SECRET: 'my secret',
};

const {
  TEST_DB_NAME,
  DATABASE_URL,
  DATABASE_CLEAN_HOUR,
  MEMBERSHIP_REFRESH_TTL_SECONDS,
  NO_SSL,
  PRIVATE_KEY,
  TBC_BALANCE_TTL_SECONDS,
  ALLOWED_EVENTS,
  INIT_TEST_DB,
  JWT_SECRET,
} = process.env;

const NAME =
  target.NODE_ENV === 'test' ? TEST_DB_NAME || 'common_test' : 'commonwealth';

export const config = configure(
  target,
  {
    DB: {
      URI:
        target.NODE_ENV === 'production'
          ? DATABASE_URL!
          : `postgresql://commonwealth:edgeware@localhost/${NAME}`,
      NAME,
      NO_SSL: NO_SSL === 'true',
      CLEAN_HOUR: DATABASE_CLEAN_HOUR
        ? parseInt(DATABASE_CLEAN_HOUR, 10)
        : undefined,
      INIT_TEST_DB: INIT_TEST_DB === 'true',
    },
    MEMBERSHIP_REFRESH_TTL_SECONDS: parseInt(
      MEMBERSHIP_REFRESH_TTL_SECONDS ?? '120',
      10,
    ),
    WEB3: {
      PRIVATE_KEY: PRIVATE_KEY || '',
    },
    TBC: {
      TTL_SECS: TBC_BALANCE_TTL_SECONDS
        ? parseInt(TBC_BALANCE_TTL_SECONDS, 10)
        : 300,
    },
    OUTBOX: {
      ALLOWED_EVENTS: ALLOWED_EVENTS ? ALLOWED_EVENTS.split(',') : [],
    },
    AUTH: {
      JWT_SECRET: JWT_SECRET || DEFAULTS.JWT_SECRET,
      SESSION_EXPIRY_MILLIS: 30 * 24 * 60 * 60 * 1000,
    },
  },
  z.object({
    DB: z.object({
      URI: z.string(),
      NAME: z.string(),
      NO_SSL: z.boolean(),
      CLEAN_HOUR: z.coerce.number().int().min(0).max(24).optional(),
      INIT_TEST_DB: z.boolean(),
    }),
    MEMBERSHIP_REFRESH_TTL_SECONDS: z.number().int().positive(),
    WEB3: z.object({
      PRIVATE_KEY: z.string(),
    }),
    TBC: z.object({
      TTL_SECS: z.number().int(),
    }),
    OUTBOX: z.object({
      ALLOWED_EVENTS: z.array(z.string()),
    }),
    AUTH: z
      .object({
        JWT_SECRET: z.string(),
        SESSION_EXPIRY_MILLIS: z.number().int(),
      })
      .refine(
        (data) => {
          if (target.NODE_ENV === 'production') {
            return !!JWT_SECRET && data.JWT_SECRET !== DEFAULTS.JWT_SECRET;
          }
          return true;
        },
        {
          message:
            'JWT_SECRET must be set to a non-default value in production environments',
          path: ['JWT_SECRET'],
        },
      ),
  }),
);

console.log('FIXME: END ' + import.meta.url);
