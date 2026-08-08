import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';
import { z } from 'zod';
import { tenants } from '../schema/tenants.js';
import { withoutServerColumns } from './shared/column-sets.js';
import { withDateRefinements } from './shared/date-refinements.js';

export const selectTenantSchema = createSelectSchema(
  tenants,
  withDateRefinements(tenants),
);
export const tenantResponseSchema = selectTenantSchema;

export const insertTenantSchema = createInsertSchema(tenants, {
  name: (schema) => schema.min(1).max(150),
  billingEmail: () => z.email(),
}).omit(withoutServerColumns(tenants));

export const updateTenantSchema = createUpdateSchema(tenants).omit(
  withoutServerColumns(tenants),
);
