import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';
import { cycleAdjustments } from '../schema/cycle-adjustments.js';
import { withoutServerColumns } from './shared/column-sets.js';
import { withDateRefinements } from './shared/date-refinements.js';

export const selectCycleAdjustmentSchema = createSelectSchema(
  cycleAdjustments,
  withDateRefinements(cycleAdjustments),
);
export const cycleAdjustmentResponseSchema = selectCycleAdjustmentSchema;

export const insertCycleAdjustmentSchema = createInsertSchema(
  cycleAdjustments,
  {
    reason: (schema) => schema.min(1),
  },
).omit(withoutServerColumns(cycleAdjustments));

export const updateCycleAdjustmentSchema = createUpdateSchema(
  cycleAdjustments,
).omit(withoutServerColumns(cycleAdjustments));
