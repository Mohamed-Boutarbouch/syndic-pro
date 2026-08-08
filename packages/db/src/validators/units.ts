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
  label: (s) => s.min(3).max(120),
}).omit(withoutServerColumns(units));

export const updateUnitSchema = createUpdateSchema(units).omit(
  withoutServerColumns(units),
);
