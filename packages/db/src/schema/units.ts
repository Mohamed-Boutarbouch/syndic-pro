import { integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { buildings } from './buildings.js';

export const units = pgTable('units', {
  id: uuid('id').primaryKey().defaultRandom(),
  buildingId: uuid('building_id')
    .notNull()
    .references(() => buildings.id, { onDelete: 'cascade' }),
  label: text('label').notNull(),
  floor: integer('floor').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
