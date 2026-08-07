import { z } from 'zod';
import {
  insertUnitSchema,
  selectUnitSchema,
  updateUnitSchema,
} from '../validators/units.js';

export type Unit = z.infer<typeof selectUnitSchema>;
export type NewUnit = z.infer<typeof insertUnitSchema>;
export type UpdateUnit = z.infer<typeof updateUnitSchema>;
