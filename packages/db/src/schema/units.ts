import { pgTable, uuid, text, integer, timestamp } from 'drizzle-orm/pg-core';

export const units = pgTable('units', {
  id: uuid('id').primaryKey().defaultRandom(),
  buildingId: uuid('building_id').notNull(),
  label: text('label').notNull(),
  floor: integer('floor').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
