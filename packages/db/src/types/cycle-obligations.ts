import { z } from 'zod';
import {
  insertCycleObligationSchema,
  selectCycleObligationSchema,
  updateCycleObligationSchema,
} from '../validators/cycle-obligations.js';

export type CycleObligation = z.infer<typeof selectCycleObligationSchema>;
export type NewCycleObligation = z.infer<typeof insertCycleObligationSchema>;
export type UpdateCycleObligation = z.infer<typeof updateCycleObligationSchema>;
