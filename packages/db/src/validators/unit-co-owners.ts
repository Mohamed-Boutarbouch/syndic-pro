import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';
import { unitCoOwners } from '../schema/unit-co-owners.js';
import { dateAsIsoString, SERVER_OMIT } from './helpers.js';

export const selectUnitCoOwnerSchema = createSelectSchema(unitCoOwners, {
  createdAt: dateAsIsoString,
  updatedAt: dateAsIsoString,
});
export const unitCoOwnerResponseSchema = selectUnitCoOwnerSchema;

export const insertUnitCoOwnerSchema = createInsertSchema(unitCoOwners, {
  ownershipPercentage: (schema) => schema.min(0).max(100).optional(),
}).omit(SERVER_OMIT);

export const updateUnitCoOwnerSchema = createUpdateSchema(unitCoOwners, {
  ownershipPercentage: (schema) => schema.min(0).max(100).optional(),
}).omit(SERVER_OMIT);
