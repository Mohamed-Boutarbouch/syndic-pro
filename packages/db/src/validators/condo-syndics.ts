import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';
import { condoSyndics } from '../schema/condo-syndics.js';
import { dateAsIsoString, SERVER_OMIT } from './helpers.js';

export const selectCondoSyndicSchema = createSelectSchema(condoSyndics, {
  createdAt: dateAsIsoString,
  updatedAt: dateAsIsoString,
});
export const condoSyndicResponseSchema = selectCondoSyndicSchema;

export const insertCondoSyndicSchema =
  createInsertSchema(condoSyndics).omit(SERVER_OMIT);

export const updateCondoSyndicSchema =
  createUpdateSchema(condoSyndics).omit(SERVER_OMIT);
