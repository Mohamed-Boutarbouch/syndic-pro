import { z } from 'zod';
import {
  insertAnnualTargetBudgetSchema,
  selectAnnualTargetBudgetSchema,
  updateAnnualTargetBudgetSchema,
} from '../validators/annual-target-budgets.js';

export type AnnualTargetBudget = z.infer<typeof selectAnnualTargetBudgetSchema>;
export type NewAnnualTargetBudget = z.infer<
  typeof insertAnnualTargetBudgetSchema
>;
export type UpdateAnnualTargetBudget = z.infer<
  typeof updateAnnualTargetBudgetSchema
>;
