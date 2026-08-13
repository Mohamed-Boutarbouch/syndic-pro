import { relations } from 'drizzle-orm';
import { units } from '../schema/units.js';
import { properties } from '../schema/properties.js';
import { ownerships } from '../schema/ownerships.js';

export const unitsRelations = relations(units, ({ one, many }) => ({
  property: one(properties, {
    fields: [units.propertyId],
    references: [properties.id],
  }),
  ownerships: many(ownerships),
}));
