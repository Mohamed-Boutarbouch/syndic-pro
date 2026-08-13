import { relations } from 'drizzle-orm';
import { propertySyndics } from '../schema/property-syndics.js';
import { properties } from '../schema/properties.js';
import { users } from '../schema/users.js';

export const propertySyndicsRelations = relations(
  propertySyndics,
  ({ one }) => ({
    property: one(properties, {
      fields: [propertySyndics.propertyId],
      references: [properties.id],
    }),
    user: one(users, {
      fields: [propertySyndics.userId],
      references: [users.id],
      relationName: 'syndic',
    }),
    transferredFromUser: one(users, {
      fields: [propertySyndics.transferredFromUserId],
      references: [users.id],
      relationName: 'transferredFromSyndic',
    }),
  }),
);
