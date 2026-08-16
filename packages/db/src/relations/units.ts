import { relations } from 'drizzle-orm';
import { units } from '../schema/units.js';
import { properties } from '../schema/properties.js';
import { unitCoOwners } from '../schema/unit-co-owners.js';
import { unitOwnerships } from '../schema/unit-ownerships.js';

export const unitsRelations = relations(units, ({ one, many }) => ({
  property: one(properties, {
    fields: [units.propertyId],
    references: [properties.id],
  }),
  unitCoOwners: many(unitCoOwners),
  unitOwnerships: many(unitOwnerships),
}));
