import {
  boolean,
  integer,
  numeric,
  pgTable,
  unique,
} from 'drizzle-orm/pg-core';
import { baseId, timestamps } from './helpers/columns.js';
import { units } from './units.js';
import { coOwners } from './co-owners.js';
import { billingFrequency } from './enums.js';

export const unitCoOwners = pgTable(
  'unit_co_owners',
  {
    ...baseId,

    unitId: integer('unit_id')
      .notNull()
      .references(() => units.id, { onDelete: 'cascade' }),

    coOwnerId: integer('co_owner_id')
      .notNull()
      .references(() => coOwners.id, { onDelete: 'cascade' }),

    ownershipPercentage: numeric('ownership_percentage', {
      precision: 5,
      scale: 2,
      mode: 'number',
    }),

    billingFrequency: billingFrequency('billing_frequency')
      .notNull()
      .default('monthly'),

    isDesignatedSyndic: boolean('is_designated_syndic')
      .default(false)
      .notNull(),

    ...timestamps,
  },
  (table) => [
    unique('uq_unit_co_owners_unit_co_owner').on(table.unitId, table.coOwnerId),
  ],
);
