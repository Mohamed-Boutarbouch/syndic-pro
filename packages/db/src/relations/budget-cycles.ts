import { relations } from 'drizzle-orm';
import { budgetCycles } from '../schema/budget-cycles.js';
import { condos } from '../schema/condos.js';
import { users } from '../schema/users.js';
import { cycleAdjustments } from '../schema/cycle-adjustments.js';
import { cycleObligations } from '../schema/cycle-obligations.js';

export const budgetCyclesRelations = relations(budgetCycles, ({ one, many }) => ({
  condo: one(condos, {
    fields: [budgetCycles.condoId],
    references: [condos.id],
  }),
  activatedByUser: one(users, {
    fields: [budgetCycles.activatedByUserId],
    references: [users.id],
  }),
  adjustments: many(cycleAdjustments),
  obligations: many(cycleObligations),
}));
