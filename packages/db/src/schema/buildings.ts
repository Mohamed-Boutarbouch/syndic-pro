import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const buildings = pgTable('buildings', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
