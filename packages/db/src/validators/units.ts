import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';
import { units } from '../schema/units.js';
import { withoutServerColumns } from './shared/column-sets.js';
import { withDateRefinements } from './shared/date-refinements.js';

export const selectUnitSchema = createSelectSchema(
  units,
  withDateRefinements(units),
);
export const unitResponseSchema = selectUnitSchema;

export const insertUnitSchema = createInsertSchema(units, {
  unitNumber: (schema) => schema.min(1).max(30),
  contributionWeight: (schema) => schema.positive(),
}).omit(withoutServerColumns(units));

export const updateUnitSchema = createUpdateSchema(units).omit(
  withoutServerColumns(units),
);
