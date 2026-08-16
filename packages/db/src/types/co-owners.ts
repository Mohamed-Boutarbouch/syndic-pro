import { z } from 'zod';
import {
  insertCoOwnerSchema,
  selectCoOwnerSchema,
  updateCoOwnerSchema,
} from '../validators/co-owners.js';

export type CoOwner = z.infer<typeof selectCoOwnerSchema>;
export type NewCoOwner = z.infer<typeof insertCoOwnerSchema>;
export type UpdateCoOwner = z.infer<typeof updateCoOwnerSchema>;
