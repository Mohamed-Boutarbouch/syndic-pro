import { z } from 'zod';
import {
  createAnnualTargetBudgetSchema,
  updateAnnualTargetBudgetSchema,
  annualTargetBudgetResponseSchema,
} from '@syndic-pro/validators';

export type CreateAnnualTargetBudget = z.infer<
  typeof createAnnualTargetBudgetSchema
>;
export type UpdateAnnualTargetBudget = z.infer<
  typeof updateAnnualTargetBudgetSchema
>;
export type AnnualTargetBudgetResponse = z.infer<
  typeof annualTargetBudgetResponseSchema
>;
