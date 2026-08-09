import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';
import { ownerships } from '../schema/ownerships.js';
import { dateAsIsoString, SERVER_OMIT } from './helpers.js';

export const selectOwnershipSchema = createSelectSchema(ownerships, {
  createdAt: dateAsIsoString,
  updatedAt: dateAsIsoString,
});
export const ownershipResponseSchema = selectOwnershipSchema;

export const insertOwnershipSchema =
  createInsertSchema(ownerships).omit(SERVER_OMIT);

export const updateOwnershipSchema =
  createUpdateSchema(ownerships).omit(SERVER_OMIT);
