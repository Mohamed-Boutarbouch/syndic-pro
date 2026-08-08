import { relations } from 'drizzle-orm';
import { invitations } from '../schema/invitations.js';
import { tenants } from '../schema/tenants.js';
import { condos } from '../schema/condos.js';
import { users } from '../schema/users.js';

export const invitationsRelations = relations(invitations, ({ one }) => ({
  tenant: one(tenants, {
    fields: [invitations.tenantId],
    references: [tenants.id],
  }),
  condo: one(condos, {
    fields: [invitations.condoId],
    references: [condos.id],
  }),
  invitedByUser: one(users, {
    fields: [invitations.invitedByUserId],
    references: [users.id],
    relationName: 'invitationsSent',
  }),
  user: one(users, {
    fields: [invitations.userId],
    references: [users.id],
    relationName: 'invitationsReceived',
  }),
}));
