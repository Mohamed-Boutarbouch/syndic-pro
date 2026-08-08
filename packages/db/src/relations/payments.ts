import { relations } from 'drizzle-orm';
import { payments } from '../schema/payments.js';
import { cycleObligations } from '../schema/cycle-obligations.js';
import { paymentSchedules } from '../schema/payment-schedules.js';
import { users } from '../schema/users.js';

export const paymentsRelations = relations(payments, ({ one }) => ({
  cycleObligation: one(cycleObligations, {
    fields: [payments.cycleObligationId],
    references: [cycleObligations.id],
  }),
  paymentSchedule: one(paymentSchedules, {
    fields: [payments.paymentScheduleId],
    references: [paymentSchedules.id],
  }),
  paidByUser: one(users, {
    fields: [payments.paidByUserId],
    references: [users.id],
    relationName: 'paymentsAsPayer',
  }),
  recordedByUser: one(users, {
    fields: [payments.recordedByUserId],
    references: [users.id],
    relationName: 'paymentsAsRecorder',
  }),
  voidedByUser: one(users, {
    fields: [payments.voidedByUserId],
    references: [users.id],
    relationName: 'paymentsAsVoider',
  }),
}));
