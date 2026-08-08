import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';
import { cycleObligations } from '../schema/cycle-obligations.js';
import { withoutServerColumns } from './shared/column-sets.js';
import { withDateRefinements } from './shared/date-refinements.js';

export const selectCycleObligationSchema = createSelectSchema(
  cycleObligations,
  withDateRefinements(cycleObligations),
);
export const cycleObligationResponseSchema = selectCycleObligationSchema;

export const insertCycleObligationSchema = createInsertSchema(
  cycleObligations,
  {
    shareAmount: (schema) => schema.positive(),
    baseMonthlyRate: (schema) => schema.positive(),
  },
).omit(withoutServerColumns(cycleObligations));

export const updateCycleObligationSchema = createUpdateSchema(
  cycleObligations,
).omit(withoutServerColumns(cycleObligations));
