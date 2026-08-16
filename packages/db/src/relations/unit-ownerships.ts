import { relations } from 'drizzle-orm';
import { unitOwnerships } from '../schema/unit-ownerships.js';
import { units } from '../schema/units.js';
import { user } from '../schema/auth/index.js';
import { cycleAdjustments } from '../schema/cycle-adjustments.js';

export const unitOwnershipsRelations = relations(
  unitOwnerships,
  ({ one, many }) => ({
    unit: one(units, {
      fields: [unitOwnerships.unitId],
      references: [units.id],
    }),
    user: one(user, { fields: [unitOwnerships.userId], references: [user.id] }),
    // cycleAdjustments.relatedOwnershipId -> unitOwnerships.id
    cycleAdjustments: many(cycleAdjustments),
  }),
);
