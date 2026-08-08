import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';
import { condos } from '../schema/condos.js';
import { withoutServerColumns } from './shared/column-sets.js';
import { withDateRefinements } from './shared/date-refinements.js';

export const selectCondoSchema = createSelectSchema(
  condos,
  withDateRefinements(condos),
);
export const condoResponseSchema = selectCondoSchema;

export const insertCondoSchema = createInsertSchema(condos, {
  name: (schema) => schema.min(1).max(200),
  city: (schema) => schema.min(1).max(100),
  countryCode: (schema) => schema.length(2),
}).omit(withoutServerColumns(condos));

export const updateCondoSchema = createUpdateSchema(condos).omit(
  withoutServerColumns(condos),
);
