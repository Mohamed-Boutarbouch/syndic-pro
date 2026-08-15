import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { createDbClient } from '@syndic-pro/db/client';

const db = createDbClient(process.env.DATABASE_URL!);

// apps/api/src/auth/auth.config.ts
export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: 'pg' }),
  baseURL: process.env.BETTER_AUTH_URL,
  basePath: '/api/auth', // full path — Nest's global prefix does NOT apply to this
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [process.env.WEB_ORIGIN!],
  emailAndPassword: { enabled: true },
  user: {
    additionalFields: {
      phone: { type: 'string', required: false },
      locale: { type: 'string', required: false, defaultValue: 'en' },
      isActive: { type: 'boolean', required: false, defaultValue: true },
    },
  },
  advanced: {
    crossSubDomainCookies: { enabled: false },
  },
});
