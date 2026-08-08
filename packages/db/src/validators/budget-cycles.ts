import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';
import { budgetCycles } from '../schema/budget-cycles.js';
import { withoutServerColumns } from './shared/column-sets.js';
import { withDateRefinements } from './shared/date-refinements.js';

export const selectBudgetCycleSchema = createSelectSchema(
  budgetCycles,
  withDateRefinements(budgetCycles),
);
export const budgetCycleResponseSchema = selectBudgetCycleSchema;

export const insertBudgetCycleSchema = createInsertSchema(budgetCycles, {
  label: (schema) => schema.min(1).max(50),
  totalBudget: (schema) => schema.nonnegative(),
}).omit(withoutServerColumns(budgetCycles));

export const updateBudgetCycleSchema = createUpdateSchema(budgetCycles).omit(
  withoutServerColumns(budgetCycles),
);
