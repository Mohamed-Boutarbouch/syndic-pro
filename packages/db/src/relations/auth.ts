import { relations } from 'drizzle-orm';
import { user, session, account } from '../schema/auth/index.js';
import { coOwners } from '../schema/co-owners.js';
import { unitOwnerships } from '../schema/unit-ownerships.js';
import { syndicDesignations } from '../schema/syndic-designations.js';
import { cycleAdjustments } from '../schema/cycle-adjustments.js';
import { payments } from '../schema/payments.js';
import { paymentCoPayers } from '../schema/payment-co-payers.js';
import { invitations } from '../schema/invitations.js';
import { annualTargetBudgets } from '../schema/annual-target-budgets.js';

export const userRelations = relations(user, ({ one, many }) => ({
  sessions: many(session),
  accounts: many(account),

  coOwnerProfile: one(coOwners, {
    fields: [user.id],
    references: [coOwners.userId],
  }),

  unitOwnerships: many(unitOwnerships),

  syndicDesignations: many(syndicDesignations, { relationName: 'syndic' }),
  transferredSyndicDesignations: many(syndicDesignations, {
    relationName: 'transferredFromSyndic',
  }),

  createdAnnualTargetBudgets: many(annualTargetBudgets),
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
  user: one(user, { fields: [session.userId], references: [user.id] }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, { fields: [account.userId], references: [user.id] }),
}));
