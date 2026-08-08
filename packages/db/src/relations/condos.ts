import { relations } from 'drizzle-orm';
import { condos } from '../schema/condos.js';
import { tenants } from '../schema/tenants.js';
import { units } from '../schema/units.js';
import { condoSyndics } from '../schema/condo-syndics.js';
import { budgetCycles } from '../schema/budget-cycles.js';
import { invitations } from '../schema/invitations.js';

export const condosRelations = relations(condos, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [condos.tenantId],
    references: [tenants.id],
  }),
  units: many(units),
  condoSyndics: many(condoSyndics),
  budgetCycles: many(budgetCycles),
  invitations: many(invitations),
}));
