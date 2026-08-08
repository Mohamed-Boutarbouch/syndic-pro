import { relations } from 'drizzle-orm';
import { users } from '../schema/users.js';
import { tenantUsers } from '../schema/tenant-users.js';
import { ownerships } from '../schema/ownerships.js';
import { condoSyndics } from '../schema/condo-syndics.js';
import { cycleAdjustments } from '../schema/cycle-adjustments.js';
import { payments } from '../schema/payments.js';
import { paymentCoPayers } from '../schema/payment-co-payers.js';
import { invitations } from '../schema/invitations.js';

export const usersRelations = relations(users, ({ many }) => ({
  tenantUsers: many(tenantUsers),
  ownerships: many(ownerships),
  condoSyndics: many(condoSyndics, { relationName: 'syndic' }),
  transferredCondoSyndics: many(condoSyndics, {
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
