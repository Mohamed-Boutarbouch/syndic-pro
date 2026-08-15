import * as dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../../apps/api/.env') });

import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { createDbClient } from './client.js';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const db = createDbClient(process.env.DATABASE_URL!);
export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: 'pg' }),
  user: {
    additionalFields: {
      phone: { type: 'string', required: false },
      locale: { type: 'string', required: false, defaultValue: 'en' },
      isActive: { type: 'boolean', required: false, defaultValue: true },
    },
  },
  emailAndPassword: { enabled: true },
});
