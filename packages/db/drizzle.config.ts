import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';
import path from 'path';

const envPath = path.resolve(__dirname, '../../apps/api/.env');
dotenv.config({ path: envPath });

if (!process.env.DATABASE_URL) {
  throw new Error(`DATABASE_URL is missing! Checked path: ${envPath}`);
}

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/schema/**/*.ts',
  out: './migrations',
  dbCredentials: {
    url: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  },
  verbose: true,
  strict: true,
});
