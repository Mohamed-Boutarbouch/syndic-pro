import { z } from 'zod';
import {
  insertCycleAdjustmentSchema,
  selectCycleAdjustmentSchema,
  updateCycleAdjustmentSchema,
} from '../validators/cycle-adjustments.js';

export type CycleAdjustment = z.infer<typeof selectCycleAdjustmentSchema>;
export type NewCycleAdjustment = z.infer<typeof insertCycleAdjustmentSchema>;
export type UpdateCycleAdjustment = z.infer<typeof updateCycleAdjustmentSchema>;
