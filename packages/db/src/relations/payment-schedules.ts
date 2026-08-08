import { relations } from 'drizzle-orm';
import { paymentSchedules } from '../schema/payment-schedules.js';
import { cycleObligations } from '../schema/cycle-obligations.js';
import { paymentCoPayers } from '../schema/payment-co-payers.js';
import { payments } from '../schema/payments.js';

export const paymentSchedulesRelations = relations(
  paymentSchedules,
  ({ one, many }) => ({
    cycleObligation: one(cycleObligations, {
      fields: [paymentSchedules.cycleObligationId],
      references: [cycleObligations.id],
    }),
    coPayers: many(paymentCoPayers),
    payments: many(payments),
  }),
);
