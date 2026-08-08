import { z } from 'zod';
import {
  insertCondoSyndicSchema,
  selectCondoSyndicSchema,
  updateCondoSyndicSchema,
} from '../validators/condo-syndics.js';

export type CondoSyndic = z.infer<typeof selectCondoSyndicSchema>;
export type NewCondoSyndic = z.infer<typeof insertCondoSyndicSchema>;
export type UpdateCondoSyndic = z.infer<typeof updateCondoSyndicSchema>;
