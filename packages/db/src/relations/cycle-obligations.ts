import { relations } from 'drizzle-orm';
import { cycleObligations } from '../schema/cycle-obligations.js';
import { budgetCycles } from '../schema/budget-cycles.js';
import { ownerships } from '../schema/ownerships.js';
import { paymentSchedules } from '../schema/payment-schedules.js';
import { payments } from '../schema/payments.js';

export const cycleObligationsRelations = relations(
  cycleObligations,
  ({ one, many }) => ({
    budgetCycle: one(budgetCycles, {
      fields: [cycleObligations.budgetCycleId],
      references: [budgetCycles.id],
    }),
    ownership: one(ownerships, {
      fields: [cycleObligations.ownershipId],
      references: [ownerships.id],
    }),
    paymentSchedules: many(paymentSchedules),
    payments: many(payments),
  }),
);
