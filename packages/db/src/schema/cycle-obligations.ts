import {
  date,
  index,
  integer,
  numeric,
  pgTable,
  smallint,
  text,
  unique,
} from 'drizzle-orm/pg-core';
import { baseId, timestamps } from './helpers/columns.js';
import { obligationStatus } from './enums.js';
import { annualTargetBudgets } from './annual-target-budgets.js';
import { unitCoOwners } from './unit-co-owners.js';

export const cycleObligations = pgTable(
  'cycle_obligations',
  {
    ...baseId,
    annualTargetBudgetId: integer('annual_target_budget_id')
      .notNull()
      .references(() => annualTargetBudgets.id, { onDelete: 'restrict' }),
    ownershipId: integer('ownership_id')
      .notNull()
      .references(() => unitCoOwners.id, { onDelete: 'restrict' }),
    shareAmount: numeric('share_amount', {
      precision: 12,
      scale: 2,
      mode: 'number',
    }).notNull(),
    snapshotContributionWeight: numeric('snapshot_contribution_weight', {
      precision: 5,
      scale: 2,
      mode: 'number',
    }).notNull(),
    baseMonthlyRate: numeric('base_monthly_rate', {
      precision: 12,
      scale: 2,
      mode: 'number',
    }).notNull(),
    paymentIntervalMonths: smallint('payment_interval_months')
      .notNull()
      .default(1),
    creditBalance: numeric('credit_balance', {
      precision: 12,
      scale: 2,
      mode: 'number',
    })
      .notNull()
      .default(0),
    status: obligationStatus('status').notNull().default('active'),
    departedAt: date('departed_at', { mode: 'date' }),
    notes: text('notes'),
    ...timestamps,
  },
  (table) => [
    unique('cycle_obligations_unique_per_budget_ownership').on(
      table.annualTargetBudgetId,
      table.ownershipId,
    ),
    index('idx_cycle_obligations_budget_id').on(table.annualTargetBudgetId),
    index('idx_cycle_obligations_ownership_id').on(table.ownershipId),
    index('idx_cycle_obligations_status').on(
      table.annualTargetBudgetId,
      table.status,
    ),
  ],
);
