import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';
import { units } from '../schema/units.js';
import { dateAsIsoString, SERVER_OMIT } from './helpers.js';

export const selectUnitSchema = createSelectSchema(units, {
  createdAt: dateAsIsoString,
  updatedAt: dateAsIsoString,
});
export const unitResponseSchema = selectUnitSchema;

export const insertUnitSchema = createInsertSchema(units, {
  unitLabel: (schema) => schema.min(1).max(30),
  weightCoefficient: (schema) => schema.positive(),
}).omit(SERVER_OMIT);

export const updateUnitSchema = createUpdateSchema(units, {
  unitLabel: (schema) => schema.min(1).max(30),
  weightCoefficient: (schema) => schema.positive(),
}).omit(SERVER_OMIT);
