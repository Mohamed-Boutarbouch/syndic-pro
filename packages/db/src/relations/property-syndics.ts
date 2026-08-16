// import { relations } from 'drizzle-orm';
// import { propertySyndics } from '../schema/syndic-designations.js';
// import { properties } from '../schema/properties.js';
// import { user } from '../schema/index.js';

// export const propertySyndicsRelations = relations(
//   propertySyndics,
//   ({ one }) => ({
//     property: one(properties, {
//       fields: [propertySyndics.propertyId],
//       references: [properties.id],
//     }),
//     user: one(user, {
//       fields: [propertySyndics.userId],
//       references: [user.id],
//       relationName: 'syndic',
//     }),
//     transferredFromUser: one(user, {
//       fields: [propertySyndics.transferredFromUserId],
//       references: [user.id],
//       relationName: 'transferredFromSyndic',
//     }),
//   }),
// );
