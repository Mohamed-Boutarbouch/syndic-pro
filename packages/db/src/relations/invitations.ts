import { relations } from 'drizzle-orm';
import { invitations } from '../schema/invitations.js';
import { properties } from '../schema/properties.js';
import { users } from '../schema/users.js';

export const invitationsRelations = relations(invitations, ({ one }) => ({
  property: one(properties, {
    fields: [invitations.propertyId],
    references: [properties.id],
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
