import { relations } from 'drizzle-orm';
import { unitCoOwners } from '../schema/unit-co-owners.js';
import { units } from '../schema/units.js';
import { coOwners } from '../schema/co-owners.js';
import { cycleObligations } from '../schema/cycle-obligations.js';

export const unitCoOwnersRelations = relations(
  unitCoOwners,
  ({ one, many }) => ({
    unit: one(units, { fields: [unitCoOwners.unitId], references: [units.id] }),
    coOwner: one(coOwners, {
      fields: [unitCoOwners.coOwnerId],
      references: [coOwners.id],
    }),
    // cycleObligations.ownershipId -> unitCoOwners.id
    cycleObligations: many(cycleObligations),
  }),
);
