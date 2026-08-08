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
import { condos } from './condos.js';

export const units = pgTable(
  'units',
  {
    ...baseId,
    condoId: integer('condo_id')
      .notNull()
      .references(() => condos.id, { onDelete: 'cascade' }),
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
    unique('units_unique_number_per_condo').on(table.condoId, table.unitNumber),
    index('idx_units_condo_id').on(table.condoId),
    index('idx_units_type').on(table.condoId, table.type),
  ],
);
