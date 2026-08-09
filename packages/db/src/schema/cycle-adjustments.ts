import { index, integer, numeric, text, timestamp } from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';
import { baseId } from './helpers/columns.js';
import { adjustmentType } from './enums.js';
import { budgetCycles } from './budget-cycles.js';
import { ownerships } from './ownerships.js';
import { users } from './users.js';

export const cycleAdjustments = pgTable(
  'cycle_adjustments',
  {
    ...baseId,
    budgetCycleId: integer('budget_cycle_id')
      .notNull()
      .references(() => budgetCycles.id, { onDelete: 'restrict' }),
    type: adjustmentType('type').notNull(),
    deltaAmount: numeric('delta_amount', {
      precision: 12,
      scale: 2,
      mode: 'number',
    }).notNull(),
    reason: text('reason').notNull(),
    relatedOwnershipId: integer('related_ownership_id').references(
      () => ownerships.id,
      { onDelete: 'set null' },
    ),
    createdByUserId: integer('created_by_user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    createdAt: timestamp('created_at', { mode: 'date', withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: true })
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index('idx_cycle_adjustments_cycle_id').on(table.budgetCycleId)],
);
