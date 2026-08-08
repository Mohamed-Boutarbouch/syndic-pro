import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';
import { z } from 'zod';
import { users } from '../schema/users.js';
import { withoutServerColumns } from './shared/column-sets.js';
import { withDateRefinements } from './shared/date-refinements.js';

export const selectUserSchema = createSelectSchema(
  users,
  withDateRefinements(users),
);
export const userResponseSchema = selectUserSchema.omit({
  passwordHash: true,
  rememberToken: true,
});

export const insertUserSchema = createInsertSchema(users, {
  name: (schema) => schema.min(1).max(150),
  email: () => z.email(),
  passwordHash: (schema) => schema.min(1),
}).omit(withoutServerColumns(users));

export const updateUserSchema = createUpdateSchema(users).omit(
  withoutServerColumns(users),
);
