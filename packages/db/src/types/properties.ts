import { z } from 'zod';
import {
  insertPropertySchema,
  selectPropertySchema,
  updatePropertySchema,
} from '../validators/properties.js';

export type Property = z.infer<typeof selectPropertySchema>;
export type NewProperty = z.infer<typeof insertPropertySchema>;
export type UpdateProperty = z.infer<typeof updatePropertySchema>;
