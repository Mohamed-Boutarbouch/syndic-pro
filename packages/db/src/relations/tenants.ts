import { relations } from 'drizzle-orm';
import { tenants } from '../schema/tenants.js';
import { tenantUsers } from '../schema/tenant-users.js';
import { condos } from '../schema/condos.js';
import { invitations } from '../schema/invitations.js';

export const tenantsRelations = relations(tenants, ({ many }) => ({
  tenantUsers: many(tenantUsers),
  condos: many(condos),
  invitations: many(invitations),
}));
