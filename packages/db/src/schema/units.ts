import {
  boolean,
  index,
  integer,
  numeric,
  pgTable,
  unique,
  varchar,
} from 'drizzle-orm/pg-core';
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
    unitLabel: varchar('unit_number', { length: 30 }).notNull(),
    floor: varchar('floor', { length: 30 }),
    type: unitType('type').notNull().default('residential'),
    weightCoefficient: numeric('weight_coefficient', {
      precision: 5,
      scale: 2,
      mode: 'number',
    })
      .notNull()
      .default(1),
    isActive: boolean('is_active').notNull().default(true),
    ...timestamps,
  },
  (table) => [
    unique('units_unique_label_per_property').on(
      table.propertyId,
      table.unitLabel,
    ),
    index('idx_units_property_id').on(table.propertyId),
    index('idx_units_type').on(table.propertyId, table.type),
  ],
);
