import {
  boolean,
  char,
  index,
  integer,
  text,
  varchar,
} from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';
import { baseId, timestamps } from './helpers/columns.js';
import { tenants } from './tenants.js';

export const condos = pgTable(
  'condos',
  {
    ...baseId,
    tenantId: integer('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 200 }).notNull(),
    address: text('address').notNull(),
    city: varchar('city', { length: 100 }).notNull(),
    postalCode: varchar('postal_code', { length: 20 }),
    countryCode: char('country_code', { length: 2 }).notNull().default('MA'),
    isActive: boolean('is_active').notNull().default(true),
    ...timestamps,
  },
  (table) => [
    index('idx_condos_tenant_id').on(table.tenantId),
    index('idx_condos_is_active').on(table.isActive, table.tenantId),
  ],
);
