import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';
import { condos } from '../schema/condos.js';
import { dateAsIsoString, SERVER_OMIT } from './helpers.js';

export const selectCondoSchema = createSelectSchema(condos, {
  createdAt: dateAsIsoString,
  updatedAt: dateAsIsoString,
});
export const condoResponseSchema = selectCondoSchema;

export const insertCondoSchema = createInsertSchema(condos, {
  name: (schema) => schema.min(1).max(200),
  city: (schema) => schema.min(1).max(100),
  countryCode: (schema) => schema.length(2),
}).omit(SERVER_OMIT);

export const updateCondoSchema = createUpdateSchema(condos, {
  name: (schema) => schema.min(1).max(200),
  city: (schema) => schema.min(1).max(100),
  countryCode: (schema) => schema.length(2),
}).omit(SERVER_OMIT);
