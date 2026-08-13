import { z } from 'zod';
import {
  insertPropertySyndicSchema,
  selectPropertySyndicSchema,
  updatePropertySyndicSchema,
} from '../validators/property-syndics.js';

export type PropertySyndic = z.infer<typeof selectPropertySyndicSchema>;
export type NewPropertySyndic = z.infer<typeof insertPropertySyndicSchema>;
export type UpdatePropertySyndic = z.infer<typeof updatePropertySyndicSchema>;
