import {
  index,
  integer,
  timestamp,
  unique,
  varchar,
} from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';
import { baseId, timestamps } from './helpers/columns.js';
import { tenantUserRole } from './enums.js';
import { condos } from './condos.js';
import { tenants } from './tenants.js';
import { users } from './users.js';

export const invitations = pgTable(
  'invitations',
  {
    ...baseId,
    tenantId: integer('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'cascade' }),
    condoId: integer('condo_id').references(() => condos.id, {
      onDelete: 'cascade',
    }),
    invitedByUserId: integer('invited_by_user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    userId: integer('user_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    email: varchar('email', { length: 255 }).notNull(),
    role: tenantUserRole('role').notNull().default('member'),
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
    index('idx_invitations_tenant_id').on(table.tenantId),
  ],
);
