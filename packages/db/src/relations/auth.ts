import { relations } from 'drizzle-orm';
import { ownerships } from '../schema/ownerships.js';
import { propertySyndics } from '../schema/property-syndics.js';
import { cycleAdjustments } from '../schema/cycle-adjustments.js';
import { payments } from '../schema/payments.js';
import { paymentCoPayers } from '../schema/payment-co-payers.js';
import { invitations } from '../schema/invitations.js';
import { user } from '../schema/index.js';

export const userRelations = relations(user, ({ many }) => ({
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
