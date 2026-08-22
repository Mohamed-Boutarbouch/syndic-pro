import { z } from 'zod';
import {
  createPropertySchema,
  updatePropertySchema,
  propertyResponseSchema,
} from '@syndic-pro/validators';

export type CreateProperty = z.infer<typeof createPropertySchema>;
export type UpdateProperty = z.infer<typeof updatePropertySchema>;
export type PropertyResponse = z.infer<typeof propertyResponseSchema>;
