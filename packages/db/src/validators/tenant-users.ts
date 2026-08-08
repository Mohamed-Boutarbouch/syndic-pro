import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';
import { tenantUsers } from '../schema/tenant-users.js';
import { withoutServerColumns } from './shared/column-sets.js';
import { withDateRefinements } from './shared/date-refinements.js';

export const selectTenantUserSchema = createSelectSchema(
  tenantUsers,
  withDateRefinements(tenantUsers),
);
export const tenantUserResponseSchema = selectTenantUserSchema;

export const insertTenantUserSchema = createInsertSchema(tenantUsers).omit(
  withoutServerColumns(tenantUsers),
);

export const updateTenantUserSchema = createUpdateSchema(tenantUsers).omit(
  withoutServerColumns(tenantUsers),
);
