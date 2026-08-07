import { relations } from 'drizzle-orm';

import { buildings } from '../schema/buildings.js';
import { units } from '../schema/units.js';

export const buildingsRelations = relations(buildings, ({ many }) => ({
  units: many(units),
}));
