import { index, integer, timestamp, unique } from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';
import { baseId, timestamps } from './helpers/columns.js';
import { tenantUserRole } from './enums.js';
import { tenants } from './tenants.js';
import { users } from './users.js';

export const tenantUsers = pgTable(
  'tenant_users',
  {
    ...baseId,
    tenantId: integer('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'cascade' }),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    role: tenantUserRole('role').notNull().default('member'),
    invitedAt: timestamp('invited_at', { mode: 'date', withTimezone: true })
      .notNull()
      .defaultNow(),
    joinedAt: timestamp('joined_at', { mode: 'date', withTimezone: true }),
    ...timestamps,
  },
  (table) => [
    unique('tenant_users_unique_membership').on(table.tenantId, table.userId),
    index('idx_tenant_users_tenant_id').on(table.tenantId),
    index('idx_tenant_users_user_id').on(table.userId),
  ],
);
