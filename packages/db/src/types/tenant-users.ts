import { z } from 'zod';
import {
  insertTenantUserSchema,
  selectTenantUserSchema,
  updateTenantUserSchema,
} from '../validators/tenant-users.js';

export type TenantUser = z.infer<typeof selectTenantUserSchema>;
export type NewTenantUser = z.infer<typeof insertTenantUserSchema>;
export type UpdateTenantUser = z.infer<typeof updateTenantUserSchema>;
