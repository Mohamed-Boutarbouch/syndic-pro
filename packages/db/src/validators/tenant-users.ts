import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';
import { tenantUsers } from '../schema/tenant-users.js';
import { dateAsIsoString, SERVER_OMIT } from './helpers.js';

export const selectTenantUserSchema = createSelectSchema(tenantUsers, {
  createdAt: dateAsIsoString,
  updatedAt: dateAsIsoString,
});
export const tenantUserResponseSchema = selectTenantUserSchema;

export const insertTenantUserSchema =
  createInsertSchema(tenantUsers).omit(SERVER_OMIT);

export const updateTenantUserSchema =
  createUpdateSchema(tenantUsers).omit(SERVER_OMIT);
