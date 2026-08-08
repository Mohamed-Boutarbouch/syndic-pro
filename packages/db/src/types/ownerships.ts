import { z } from 'zod';
import {
  insertOwnershipSchema,
  selectOwnershipSchema,
  updateOwnershipSchema,
} from '../validators/ownerships.js';

export type Ownership = z.infer<typeof selectOwnershipSchema>;
export type NewOwnership = z.infer<typeof insertOwnershipSchema>;
export type UpdateOwnership = z.infer<typeof updateOwnershipSchema>;
