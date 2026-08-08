import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';
import { condoSyndics } from '../schema/condo-syndics.js';
import { withoutServerColumns } from './shared/column-sets.js';
import { withDateRefinements } from './shared/date-refinements.js';

export const selectCondoSyndicSchema = createSelectSchema(
  condoSyndics,
  withDateRefinements(condoSyndics),
);
export const condoSyndicResponseSchema = selectCondoSyndicSchema;

export const insertCondoSyndicSchema = createInsertSchema(condoSyndics).omit(
  withoutServerColumns(condoSyndics),
);

export const updateCondoSyndicSchema = createUpdateSchema(condoSyndics).omit(
  withoutServerColumns(condoSyndics),
);
