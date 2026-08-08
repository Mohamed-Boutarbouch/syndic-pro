import { z } from 'zod';
import {
  insertTenantSchema,
  selectTenantSchema,
  updateTenantSchema,
} from '../validators/tenants.js';

export type Tenant = z.infer<typeof selectTenantSchema>;
export type NewTenant = z.infer<typeof insertTenantSchema>;
export type UpdateTenant = z.infer<typeof updateTenantSchema>;
