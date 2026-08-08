import { relations } from 'drizzle-orm';
import { ownerships } from '../schema/ownerships.js';
import { units } from '../schema/units.js';
import { users } from '../schema/users.js';
import { cycleObligations } from '../schema/cycle-obligations.js';
import { cycleAdjustments } from '../schema/cycle-adjustments.js';

export const ownershipsRelations = relations(ownerships, ({ one, many }) => ({
  unit: one(units, {
    fields: [ownerships.unitId],
    references: [units.id],
  }),
  user: one(users, {
    fields: [ownerships.userId],
    references: [users.id],
  }),
  cycleObligations: many(cycleObligations),
  cycleAdjustments: many(cycleAdjustments),
}));
