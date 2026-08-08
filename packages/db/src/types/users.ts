import { z } from 'zod';
import {
  insertUserSchema,
  selectUserSchema,
  updateUserSchema,
} from '../validators/users.js';

export type User = z.infer<typeof selectUserSchema>;
export type NewUser = z.infer<typeof insertUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
