import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';
import { z } from 'zod';
import { annualTargetBudgets } from '../schema/annual-target-budgets.js';
import { dateAsIsoString, SERVER_OMIT } from './helpers.js';

export const selectAnnualTargetBudgetSchema = createSelectSchema(
  annualTargetBudgets,
  {
    createdAt: dateAsIsoString,
    updatedAt: dateAsIsoString,
  },
);
export const annualTargetBudgetResponseSchema = selectAnnualTargetBudgetSchema;

const budgetRefinement = {
  totalBudget: (schema: z.ZodNumber) => schema.positive(),
};

export const insertAnnualTargetBudgetSchema = createInsertSchema(
  annualTargetBudgets,
  budgetRefinement,
)
  .omit(SERVER_OMIT)
  .refine((data) => data.endDate > data.startDate, {
    message: 'endDate must be after startDate',
    path: ['endDate'],
  });

export const updateAnnualTargetBudgetSchema = createUpdateSchema(
  annualTargetBudgets,
  budgetRefinement,
).omit(SERVER_OMIT);
