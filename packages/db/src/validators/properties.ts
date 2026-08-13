import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';
import { properties } from '../schema/properties.js';
import { dateAsIsoString, SERVER_OMIT } from './helpers.js';

export const selectPropertySchema = createSelectSchema(properties, {
  createdAt: dateAsIsoString,
  updatedAt: dateAsIsoString,
});
export const propertyResponseSchema = selectPropertySchema;

export const insertPropertySchema = createInsertSchema(properties, {
  name: (schema) => schema.min(1).max(200),
  city: (schema) => schema.min(1).max(100),
  countryCode: (schema) => schema.length(2),
}).omit(SERVER_OMIT);

export const updatePropertySchema = createUpdateSchema(properties, {
  name: (schema) => schema.min(1).max(200),
  city: (schema) => schema.min(1).max(100),
  countryCode: (schema) => schema.length(2),
}).omit(SERVER_OMIT);
