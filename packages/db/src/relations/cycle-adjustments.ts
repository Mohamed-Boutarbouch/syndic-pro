import { relations } from 'drizzle-orm';
import { cycleAdjustments } from '../schema/cycle-adjustments.js';
import { annualTargetBudgets } from '../schema/annual-target-budgets.js';
import { unitOwnerships } from '../schema/unit-ownerships.js';
import { user } from '../schema/auth/index.js';

export const cycleAdjustmentsRelations = relations(
  cycleAdjustments,
  ({ one }) => ({
    annualTargetBudget: one(annualTargetBudgets, {
      fields: [cycleAdjustments.annualTargetBudgetId],
      references: [annualTargetBudgets.id],
    }),
    relatedOwnership: one(unitOwnerships, {
      fields: [cycleAdjustments.relatedOwnershipId],
      references: [unitOwnerships.id],
    }),
    createdByUser: one(user, {
      fields: [cycleAdjustments.createdByUserId],
      references: [user.id],
    }),
  }),
);
