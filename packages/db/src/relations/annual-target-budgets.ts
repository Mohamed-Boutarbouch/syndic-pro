import { relations } from 'drizzle-orm';
import { annualTargetBudgets } from '../schema/annual-target-budgets.js';
import { properties } from '../schema/properties.js';
import { user } from '../schema/auth/index.js';
import { cycleAdjustments } from '../schema/cycle-adjustments.js';
import { cycleObligations } from '../schema/cycle-obligations.js';

export const annualTargetBudgetsRelations = relations(
  annualTargetBudgets,
  ({ one, many }) => ({
    property: one(properties, {
      fields: [annualTargetBudgets.propertyId],
      references: [properties.id],
    }),
    createdByUser: one(user, {
      fields: [annualTargetBudgets.createdByUserId],
      references: [user.id],
    }),
    adjustments: many(cycleAdjustments),
    obligations: many(cycleObligations),
  }),
);
