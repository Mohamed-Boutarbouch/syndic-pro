import { relations } from 'drizzle-orm';
import { properties } from '../schema/properties.js';
import { units } from '../schema/units.js';
import { propertySyndics } from '../schema/property-syndics.js';
import { budgetCycles } from '../schema/budget-cycles.js';
import { invitations } from '../schema/invitations.js';

export const propertiesRelations = relations(properties, ({ many }) => ({
  units: many(units),
  propertySyndics: many(propertySyndics),
  budgetCycles: many(budgetCycles),
  invitations: many(invitations),
}));
