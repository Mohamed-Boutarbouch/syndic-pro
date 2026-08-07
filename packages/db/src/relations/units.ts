import { relations } from 'drizzle-orm';

import { buildings } from '../schema/buildings.js';
import { units } from '../schema/units.js';

export const unitsRelations = relations(units, ({ one }) => ({
  building: one(buildings, {
    fields: [units.buildingId],
    references: [buildings.id],
  }),
}));
