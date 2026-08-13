import {
  boolean,
  index,
  integer,
  numeric,
  smallint,
  text,
  unique,
  varchar,
} from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';
import { baseId, timestamps } from './helpers/columns.js';
import { unitType } from './enums.js';
import { properties } from './properties.js';

export const units = pgTable(
  'units',
  {
    ...baseId,
    propertyId: integer('property_id')
      .notNull()
      .references(() => properties.id, { onDelete: 'cascade' }),
    unitNumber: varchar('unit_number', { length: 30 }).notNull(),
    floor: smallint('floor'),
    type: unitType('type').notNull().default('residential'),
    contributionWeight: numeric('contribution_weight', {
      precision: 5,
      scale: 2,
      mode: 'number',
    })
      .notNull()
      .default(1),
    notes: text('notes'),
    isActive: boolean('is_active').notNull().default(true),
    ...timestamps,
  },
  (table) => [
    unique('units_unique_number_per_property').on(
      table.propertyId,
      table.unitNumber,
    ),
    index('idx_units_property_id').on(table.propertyId),
    index('idx_units_type').on(table.propertyId, table.type),
  ],
);
