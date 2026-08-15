import { relations } from 'drizzle-orm';
import { user, session, account } from '../schema/auth/schema.js';
import { ownerships } from '../schema/ownerships.js';
import { propertySyndics } from '../schema/property-syndics.js';
import { cycleAdjustments } from '../schema/cycle-adjustments.js';
import { payments } from '../schema/payments.js';
import { paymentCoPayers } from '../schema/payment-co-payers.js';
import { invitations } from '../schema/invitations.js';

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  ownerships: many(ownerships),
  propertySyndics: many(propertySyndics, { relationName: 'syndic' }),
  transferredPropertySyndics: many(propertySyndics, {
    relationName: 'transferredFromSyndic',
  }),
  cycleAdjustments: many(cycleAdjustments),
  paymentsAsPayer: many(payments, { relationName: 'paymentsAsPayer' }),
  paymentsAsRecorder: many(payments, { relationName: 'paymentsAsRecorder' }),
  paymentsAsVoider: many(payments, { relationName: 'paymentsAsVoider' }),
  paymentCoPayers: many(paymentCoPayers),
  invitationsSent: many(invitations, { relationName: 'invitationsSent' }),
  invitationsReceived: many(invitations, {
    relationName: 'invitationsReceived',
  }),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));
