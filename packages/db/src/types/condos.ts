import { z } from 'zod';
import {
  insertCondoSchema,
  selectCondoSchema,
  updateCondoSchema,
} from '../validators/condos.js';

export type Condo = z.infer<typeof selectCondoSchema>;
export type NewCondo = z.infer<typeof insertCondoSchema>;
export type UpdateCondo = z.infer<typeof updateCondoSchema>;
