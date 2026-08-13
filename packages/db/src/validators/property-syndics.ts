import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';
import { propertySyndics } from '../schema/property-syndics.js';
import { dateAsIsoString, SERVER_OMIT } from './helpers.js';

export const selectPropertySyndicSchema = createSelectSchema(propertySyndics, {
  createdAt: dateAsIsoString,
  updatedAt: dateAsIsoString,
});
export const propertySyndicResponseSchema = selectPropertySyndicSchema;

export const insertPropertySyndicSchema =
  createInsertSchema(propertySyndics).omit(SERVER_OMIT);

export const updatePropertySyndicSchema =
  createUpdateSchema(propertySyndics).omit(SERVER_OMIT);
