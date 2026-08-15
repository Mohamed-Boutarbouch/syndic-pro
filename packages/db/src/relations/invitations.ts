import { relations } from 'drizzle-orm';
import { invitations } from '../schema/invitations.js';
import { properties } from '../schema/properties.js';
import { user } from '../schema/index.js';

export const invitationsRelations = relations(invitations, ({ one }) => ({
  property: one(properties, {
    fields: [invitations.propertyId],
    references: [properties.id],
  }),
  invitedByUser: one(user, {
    fields: [invitations.invitedByUserId],
    references: [user.id],
    relationName: 'invitationsSent',
  }),
  user: one(user, {
    fields: [invitations.userId],
    references: [user.id],
    relationName: 'invitationsReceived',
  }),
}));
