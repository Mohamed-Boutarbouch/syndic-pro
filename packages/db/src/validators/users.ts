import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';
import { z } from 'zod';
import { users } from '../schema/users.js';
import { dateAsIsoString, SERVER_OMIT } from './helpers.js';

export const selectUserSchema = createSelectSchema(users, {
  createdAt: dateAsIsoString,
  updatedAt: dateAsIsoString,
});
export const userResponseSchema = selectUserSchema.omit({
  passwordHash: true,
  rememberToken: true,
});

export const insertUserSchema = createInsertSchema(users, {
  name: (schema) => schema.min(1).max(150),
  email: () => z.email(),
  passwordHash: (schema) => schema.min(1),
}).omit(SERVER_OMIT);

export const updateUserSchema = createUpdateSchema(users, {
  name: (schema) => schema.min(1).max(150),
  email: () => z.email(),
  passwordHash: (schema) => schema.min(1),
}).omit(SERVER_OMIT);
