import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';
import { z } from 'zod';
import { dateAsIsoString, SERVER_OMIT } from './helpers.js';
import { user } from '../schema/index.js';

export const selectAuthSchema = createSelectSchema(user, {
  createdAt: dateAsIsoString,
  updatedAt: dateAsIsoString,
});
export const authResponseSchema = selectAuthSchema.omit({});

export const insertAuthSchema = createInsertSchema(user, {
  name: (schema) => schema.min(1).max(150),
  email: () => z.email(),
}).omit(SERVER_OMIT);

export const updateAuthSchema = createUpdateSchema(user, {
  name: (schema) => schema.min(1).max(150),
  email: () => z.email(),
}).omit(SERVER_OMIT);
