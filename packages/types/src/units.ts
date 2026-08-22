import { z } from 'zod';
import {
  createUnitSchema,
  updateUnitSchema,
  unitResponseSchema,
} from '@syndic-pro/validators';

export type CreateUnit = z.infer<typeof createUnitSchema>;
export type UpdateUnit = z.infer<typeof updateUnitSchema>;
export type UnitResponse = z.infer<typeof unitResponseSchema>;
