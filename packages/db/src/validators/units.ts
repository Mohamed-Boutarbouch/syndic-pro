import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod';
import { units } from '../schema/units.js';

export const selectUnitSchema = createSelectSchema(units);
export const unitResponseSchema = selectUnitSchema;

export const insertUnitSchema = createInsertSchema(units, {
  label: (schema) => schema.min(1).max(120),
}).omit({
  id: true,
  createdAt: true,
});

export const updateUnitSchema = createUpdateSchema(units).omit({
  id: true,
  createdAt: true,
});
