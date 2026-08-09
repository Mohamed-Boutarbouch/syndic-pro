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
  unitNumber: (schema) => schema.min(1).max(30),
  contributionWeight: (schema) => schema.positive(),
}).omit(SERVER_OMIT);

export const updateUnitSchema = createUpdateSchema(units, {
  unitNumber: (schema) => schema.min(1).max(30),
  contributionWeight: (schema) => schema.positive(),
}).omit(SERVER_OMIT);
