import { relations } from 'drizzle-orm';
import { properties } from '../schema/properties.js';
import { units } from '../schema/units.js';
import { syndicDesignations } from '../schema/syndic-designations.js';
import { annualTargetBudgets } from '../schema/annual-target-budgets.js';
import { invitations } from '../schema/invitations.js';

export const propertiesRelations = relations(properties, ({ many }) => ({
  units: many(units),
  syndicDesignations: many(syndicDesignations),
  annualTargetBudgets: many(annualTargetBudgets),
  invitations: many(invitations),
}));
