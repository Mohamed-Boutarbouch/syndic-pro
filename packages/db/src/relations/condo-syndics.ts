import { relations } from 'drizzle-orm';
import { condoSyndics } from '../schema/condo-syndics.js';
import { condos } from '../schema/condos.js';
import { users } from '../schema/users.js';

export const condoSyndicsRelations = relations(condoSyndics, ({ one }) => ({
  condo: one(condos, {
    fields: [condoSyndics.condoId],
    references: [condos.id],
  }),
  user: one(users, {
    fields: [condoSyndics.userId],
    references: [users.id],
    relationName: 'syndic',
  }),
  transferredFromUser: one(users, {
    fields: [condoSyndics.transferredFromUserId],
    references: [users.id],
    relationName: 'transferredFromSyndic',
  }),
}));
