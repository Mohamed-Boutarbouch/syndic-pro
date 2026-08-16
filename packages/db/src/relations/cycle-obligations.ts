import { relations } from 'drizzle-orm';
import { cycleObligations } from '../schema/cycle-obligations.js';
import { annualTargetBudgets } from '../schema/annual-target-budgets.js';
import { unitCoOwners } from '../schema/unit-co-owners.js';
import { paymentSchedules } from '../schema/payment-schedules.js';
import { payments } from '../schema/payments.js';

export const cycleObligationsRelations = relations(
  cycleObligations,
  ({ one, many }) => ({
    annualTargetBudget: one(annualTargetBudgets, {
      fields: [cycleObligations.annualTargetBudgetId],
      references: [annualTargetBudgets.id],
    }),
    ownership: one(unitCoOwners, {
      fields: [cycleObligations.ownershipId],
      references: [unitCoOwners.id],
    }),
    paymentSchedules: many(paymentSchedules),
    payments: many(payments),
  }),
);
