import { relations } from 'drizzle-orm';
import { tenantUsers } from '../schema/tenant-users.js';
import { tenants } from '../schema/tenants.js';
import { users } from '../schema/users.js';

export const tenantUsersRelations = relations(tenantUsers, ({ one }) => ({
  tenant: one(tenants, {
    fields: [tenantUsers.tenantId],
    references: [tenants.id],
  }),
  user: one(users, {
    fields: [tenantUsers.userId],
    references: [users.id],
  }),
}));
