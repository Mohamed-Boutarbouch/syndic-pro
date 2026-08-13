import {
  boolean,
  index,
  timestamp,
  unique,
  varchar,
} from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';
import { baseId, timestamps } from './helpers/columns.js';

export const users = pgTable(
  'users',
  {
    ...baseId,
    name: varchar('name', { length: 150 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    emailVerifiedAt: timestamp('email_verified_at', {
      mode: 'date',
      withTimezone: true,
    }),
    phone: varchar('phone', { length: 30 }),
    passwordHash: varchar('password_hash', { length: 255 }).notNull(),
    rememberToken: varchar('remember_token', { length: 100 }),
    locale: varchar('locale', { length: 10 }).notNull().default('en'),
    isActive: boolean('is_active').notNull().default(true),
    ...timestamps,
  },
  (table) => [
    unique('users_email_unique').on(table.email),
    index('idx_users_email').on(table.email),
    index('idx_users_is_active').on(table.isActive),
  ],
);
