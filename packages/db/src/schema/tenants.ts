import { boolean, index, varchar } from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';
import { baseId, timestamps } from './helpers/columns.js';
import { tenantPlan } from './enums.js';

export const tenants = pgTable(
  'tenants',
  {
    ...baseId,
    name: varchar('name', { length: 150 }).notNull(),
    plan: tenantPlan('plan').notNull().default('starter'),
    billingEmail: varchar('billing_email', { length: 255 }).notNull(),
    isActive: boolean('is_active').notNull().default(true),
    ...timestamps,
  },
  (table) => [index('idx_tenants_is_active').on(table.isActive)],
);
