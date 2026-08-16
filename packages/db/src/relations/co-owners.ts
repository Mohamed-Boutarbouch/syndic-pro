import { relations } from 'drizzle-orm';
import { coOwners } from '../schema/co-owners.js';
import { unitCoOwners } from '../schema/unit-co-owners.js';
import { user } from '../schema/auth/index.js';

export const coOwnersRelations = relations(coOwners, ({ one, many }) => ({
  user: one(user, { fields: [coOwners.userId], references: [user.id] }),
  unitCoOwners: many(unitCoOwners),
}));
