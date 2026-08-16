import { relations } from 'drizzle-orm';
import { syndicDesignations } from '../schema/syndic-designations.js';
import { properties } from '../schema/properties.js';
import { user } from '../schema/auth/index.js';

export const syndicDesignationsRelations = relations(
  syndicDesignations,
  ({ one }) => ({
    property: one(properties, {
      fields: [syndicDesignations.propertyId],
      references: [properties.id],
    }),
    user: one(user, {
      fields: [syndicDesignations.userId],
      references: [user.id],
      relationName: 'syndic',
    }),
    transferredFromUser: one(user, {
      fields: [syndicDesignations.transferredFromUserId],
      references: [user.id],
      relationName: 'transferredFromSyndic',
    }),
  }),
);
