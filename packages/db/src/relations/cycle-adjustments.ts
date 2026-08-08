import { relations } from 'drizzle-orm';
import { cycleAdjustments } from '../schema/cycle-adjustments.js';
import { budgetCycles } from '../schema/budget-cycles.js';
import { ownerships } from '../schema/ownerships.js';
import { users } from '../schema/users.js';

export const cycleAdjustmentsRelations = relations(cycleAdjustments, ({ one }) => ({
  budgetCycle: one(budgetCycles, {
    fields: [cycleAdjustments.budgetCycleId],
    references: [budgetCycles.id],
  }),
  relatedOwnership: one(ownerships, {
    fields: [cycleAdjustments.relatedOwnershipId],
    references: [ownerships.id],
  }),
  createdByUser: one(users, {
    fields: [cycleAdjustments.createdByUserId],
    references: [users.id],
  }),
}));
