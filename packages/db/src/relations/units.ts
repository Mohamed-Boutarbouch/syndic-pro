import { relations } from 'drizzle-orm';
import { units } from '../schema/units.js';
import { condos } from '../schema/condos.js';
import { ownerships } from '../schema/ownerships.js';

export const unitsRelations = relations(units, ({ one, many }) => ({
  condo: one(condos, {
    fields: [units.condoId],
    references: [condos.id],
  }),
  ownerships: many(ownerships),
}));
