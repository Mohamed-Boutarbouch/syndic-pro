import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';
import { budgetCycles } from '../schema/budget-cycles.js';
import { dateAsIsoString, SERVER_OMIT } from './helpers.js';

export const selectBudgetCycleSchema = createSelectSchema(budgetCycles, {
  createdAt: dateAsIsoString,
  updatedAt: dateAsIsoString,
});
export const budgetCycleResponseSchema = selectBudgetCycleSchema;

export const insertBudgetCycleSchema = createInsertSchema(budgetCycles, {
  label: (schema) => schema.min(1).max(50),
  totalBudget: (schema) => schema.nonnegative(),
}).omit(SERVER_OMIT);

export const updateBudgetCycleSchema = createUpdateSchema(budgetCycles, {
  label: (schema) => schema.min(1).max(50),
  totalBudget: (schema) => schema.nonnegative(),
}).omit(SERVER_OMIT);
