import { integer, pgTable, text } from 'drizzle-orm/pg-core';

import { baseId, timestamps } from './helpers/columns.js';
import { buildings } from './buildings.js';

export const units = pgTable('units', {
  ...baseId,
  buildingId: integer('building_id')
    .notNull()
    .references(() => buildings.id, { onDelete: 'cascade' }),
  label: text('label').notNull(),
  floor: integer('floor').notNull(),
  ...timestamps,
});
