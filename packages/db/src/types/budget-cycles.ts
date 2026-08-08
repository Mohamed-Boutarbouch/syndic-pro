import { z } from 'zod';
import {
  insertBudgetCycleSchema,
  selectBudgetCycleSchema,
  updateBudgetCycleSchema,
} from '../validators/budget-cycles.js';

export type BudgetCycle = z.infer<typeof selectBudgetCycleSchema>;
export type NewBudgetCycle = z.infer<typeof insertBudgetCycleSchema>;
export type UpdateBudgetCycle = z.infer<typeof updateBudgetCycleSchema>;
