import { pgTable, uuid, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod';
import { z } from 'zod';

export const units = pgTable('units', {
  id: uuid('id').primaryKey().defaultRandom(),
  buildingId: uuid('building_id').notNull(),
  label: text('label').notNull(),
  floor: integer('floor').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// --- Zod, generated from the Drizzle table (single source of truth) ---
export const selectUnitSchema = createSelectSchema(units);
export const insertUnitSchema = createInsertSchema(units, {
  label: (schema) => schema.min(1).max(120), // custom refinement example
}).omit({ id: true, createdAt: true });

export const updateUnitSchema = createUpdateSchema(units)
  .omit({ id: true, createdAt: true })
  .partial(); // Update = Insert shape, all optional

// Response schema — often == select, but kept distinct so you can
// diverge later (e.g. omit internal-only columns) without touching
// the DB-facing select schema.
export const unitResponseSchema = selectUnitSchema;

export type Unit = z.infer<typeof selectUnitSchema>;
export type NewUnit = z.infer<typeof insertUnitSchema>;
export type UpdateUnit = z.infer<typeof updateUnitSchema>;
