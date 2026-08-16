import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';
import { unitOwnerships } from '../schema/unit-ownerships.js';
import { dateAsIsoString, SERVER_OMIT } from './helpers.js';

export const selectUnitOwnershipsSchema = createSelectSchema(unitOwnerships, {
  createdAt: dateAsIsoString,
  updatedAt: dateAsIsoString,
});
export const unitOwnershipsResponseSchema = selectUnitOwnershipsSchema;

export const insertUnitOwnershipsSchema = createInsertSchema(
  unitOwnerships,
  {},
).omit(SERVER_OMIT);

export const updateUnitOwnershipsSchema = createUpdateSchema(
  unitOwnerships,
  {},
).omit(SERVER_OMIT);
