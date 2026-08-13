import {
  index,
  integer,
  timestamp,
  unique,
  varchar,
} from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';
import { baseId, timestamps } from './helpers/columns.js';
import { properties } from './properties.js';
import { users } from './users.js';

export const invitations = pgTable(
  'invitations',
  {
    ...baseId,
    propertyId: integer('property_id').references(() => properties.id, {
      onDelete: 'cascade',
    }),
    invitedByUserId: integer('invited_by_user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    userId: integer('user_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    email: varchar('email', { length: 255 }).notNull(),
    token: varchar('token', { length: 64 }).notNull(),
    acceptedAt: timestamp('accepted_at', { mode: 'date', withTimezone: true }),
    expiresAt: timestamp('expires_at', {
      mode: 'date',
      withTimezone: true,
    }).notNull(),
    ...timestamps,
  },
  (table) => [
    unique('invitations_token_unique').on(table.token),
    index('idx_invitations_email').on(table.email),
    index('idx_invitations_token').on(table.token),
  ],
);
