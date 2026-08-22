import { z } from 'zod';
import {
  createCoOwnerSchema,
  updateCoOwnerSchema,
  coOwnerResponseSchema,
} from '@syndic-pro/validators';

export type CreateCoOwner = z.infer<typeof createCoOwnerSchema>;
export type UpdateCoOwner = z.infer<typeof updateCoOwnerSchema>;
export type CoOwnerResponse = z.infer<typeof coOwnerResponseSchema>;
