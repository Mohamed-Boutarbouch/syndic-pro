// import { relations } from 'drizzle-orm';
// import { budgetCycles } from '../schema/annual-target-budgets.js';
// import { properties } from '../schema/properties.js';
// import { cycleAdjustments } from '../schema/cycle-adjustments.js';
// import { cycleObligations } from '../schema/cycle-obligations.js';
// import { user } from '../schema/index.js';

// export const budgetCyclesRelations = relations(
//   budgetCycles,
//   ({ one, many }) => ({
//     property: one(properties, {
//       fields: [budgetCycles.propertyId],
//       references: [properties.id],
//     }),
//     activatedByUser: one(user, {
//       fields: [budgetCycles.activatedByUserId],
//       references: [user.id],
//     }),
//     adjustments: many(cycleAdjustments),
//     obligations: many(cycleObligations),
//   }),
// );
