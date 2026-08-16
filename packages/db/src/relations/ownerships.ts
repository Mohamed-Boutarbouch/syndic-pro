// import { relations } from 'drizzle-orm';
// import { ownerships } from '../schema/ownerships.js';
// import { units } from '../schema/units.js';
// import { cycleObligations } from '../schema/cycle-obligations.js';
// import { cycleAdjustments } from '../schema/cycle-adjustments.js';
// import { user } from '../schema/index.js';

// export const ownershipsRelations = relations(ownerships, ({ one, many }) => ({
//   unit: one(units, {
//     fields: [ownerships.unitId],
//     references: [units.id],
//   }),
//   user: one(user, {
//     fields: [ownerships.userId],
//     references: [user.id],
//   }),
//   cycleObligations: many(cycleObligations),
//   cycleAdjustments: many(cycleAdjustments),
// }));
