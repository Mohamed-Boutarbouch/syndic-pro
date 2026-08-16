import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';
import { z } from 'zod';
import { coOwners } from '../schema/co-owners.js';
import { dateAsIsoString, SERVER_OMIT } from './helpers.js';

export const selectCoOwnerSchema = createSelectSchema(coOwners, {
  createdAt: dateAsIsoString,
  updatedAt: dateAsIsoString,
});
export const coOwnerResponseSchema = selectCoOwnerSchema;

export const insertCoOwnerSchema = createInsertSchema(coOwners, {
  name: (schema) => schema.min(1).max(150),
  email: () => z.email().optional(),
}).omit(SERVER_OMIT);

export const updateCoOwnerSchema = createUpdateSchema(coOwners, {
  name: (schema) => schema.min(1).max(150),
  email: () => z.email().optional(),
}).omit(SERVER_OMIT);
