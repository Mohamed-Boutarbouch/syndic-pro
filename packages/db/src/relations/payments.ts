import { relations } from 'drizzle-orm';
import { payments } from '../schema/payments.js';
import { cycleObligations } from '../schema/cycle-obligations.js';
import { paymentSchedules } from '../schema/payment-schedules.js';
import { user } from '../schema/auth/index.js';

export const paymentsRelations = relations(payments, ({ one }) => ({
  cycleObligation: one(cycleObligations, {
    fields: [payments.cycleObligationId],
    references: [cycleObligations.id],
  }),
  paymentSchedule: one(paymentSchedules, {
    fields: [payments.paymentScheduleId],
    references: [paymentSchedules.id],
  }),
  paidByUser: one(user, {
    fields: [payments.paidByUserId],
    references: [user.id],
    relationName: 'paymentsAsPayer',
  }),
  recordedByUser: one(user, {
    fields: [payments.recordedByUserId],
    references: [user.id],
    relationName: 'paymentsAsRecorder',
  }),
  voidedByUser: one(user, {
    fields: [payments.voidedByUserId],
    references: [user.id],
    relationName: 'paymentsAsVoider',
  }),
}));
