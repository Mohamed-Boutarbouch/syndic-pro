import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';
import { z } from 'zod';
import { tenants } from '../schema/tenants.js';
import { dateAsIsoString, SERVER_OMIT } from './helpers.js';

export const selectTenantSchema = createSelectSchema(tenants, {
  createdAt: dateAsIsoString,
  updatedAt: dateAsIsoString,
});
export const tenantResponseSchema = selectTenantSchema;

export const insertTenantSchema = createInsertSchema(tenants, {
  name: (schema) => schema.min(1).max(150),
  billingEmail: () => z.email(),
}).omit(SERVER_OMIT);

export const updateTenantSchema = createUpdateSchema(tenants, {
  name: (schema) => schema.min(1).max(150),
  billingEmail: () => z.email(),
}).omit(SERVER_OMIT);
