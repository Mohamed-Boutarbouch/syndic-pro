import { index, integer, numeric, pgTable, text } from 'drizzle-orm/pg-core';
import { baseId, timestamps } from './helpers/columns.js';
import { adjustmentType } from './enums.js';
import { annualTargetBudgets } from './annual-target-budgets.js';
import { unitOwnerships } from './unit-ownerships.js';
import { user } from './auth/index.js';

export const cycleAdjustments = pgTable(
  'cycle_adjustments',
  {
    ...baseId,
    annualTargetBudgetId: integer('annual_target_budget_id')
      .notNull()
      .references(() => annualTargetBudgets.id, { onDelete: 'restrict' }),
    type: adjustmentType('type').notNull(),
    deltaAmount: numeric('delta_amount', {
      precision: 12,
      scale: 2,
      mode: 'number',
    }).notNull(),
    reason: text('reason').notNull(),
    relatedOwnershipId: integer('related_ownership_id').references(
      () => unitOwnerships.id,
      { onDelete: 'set null' },
    ),
    createdByUserId: text('created_by_user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'restrict' }),
    ...timestamps,
  },
  (table) => [
    index('idx_cycle_adjustments_budget_id').on(table.annualTargetBudgetId),
  ],
);
