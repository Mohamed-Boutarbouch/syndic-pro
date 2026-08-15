import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { createDbClient } from '@syndic-pro/db/client';
import { env } from '../config/env';

const db = createDbClient(env.DATABASE_URL);

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: 'pg' }),
  baseURL: process.env.BETTER_AUTH_URL,
  basePath: '/api/auth',
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [env.WEB_ORIGIN],
  emailAndPassword: { enabled: true },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
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
