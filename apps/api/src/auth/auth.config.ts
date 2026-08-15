import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { createDbClient } from '@syndic-pro/db/client';

const db = createDbClient(process.env.DATABASE_URL!);

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: 'pg' }),
  baseURL: process.env.BETTER_AUTH_URL, // e.g. http://localhost:3000
  basePath: '/auth', // matches your existing global prefix
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [process.env.WEB_ORIGIN!], // your Next.js app origin
  emailAndPassword: { enabled: true },
  user: {
    additionalFields: {
      phone: { type: 'string', required: false },
      locale: { type: 'string', required: false, defaultValue: 'en' },
      isActive: { type: 'boolean', required: false, defaultValue: true },
    },
  },
  advanced: {
    // keep cross-subdomain/cross-origin cookies working if web and api are on different origins
    crossSubDomainCookies: { enabled: false }, // enable + set domain if you use subdomains
  },
});
