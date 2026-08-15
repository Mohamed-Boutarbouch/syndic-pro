import { z } from 'zod';
import {
  insertAuthSchema,
  selectAuthSchema,
  updateAuthSchema,
} from '../validators/auth.js';

export type User = z.infer<typeof selectAuthSchema>;
export type NewUser = z.infer<typeof insertAuthSchema>;
export type UpdateUser = z.infer<typeof updateAuthSchema>;
