import {
  date,
  text,
  index,
  integer,
  numeric,
  smallint,
  unique,
} from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';
import { baseId, timestamps } from './helpers/columns.js';
import { obligationStatus } from './enums.js';
import { budgetCycles } from './budget-cycles.js';
import { ownerships } from './ownerships.js';

export const cycleObligations = pgTable(
  'cycle_obligations',
  {
    ...baseId,
    budgetCycleId: integer('budget_cycle_id')
      .notNull()
      .references(() => budgetCycles.id, { onDelete: 'restrict' }),
    ownershipId: integer('ownership_id')
      .notNull()
      .references(() => ownerships.id, { onDelete: 'restrict' }),
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
    unique('cycle_obligations_unique_per_cycle_ownership').on(
      table.budgetCycleId,
      table.ownershipId,
    ),
    index('idx_cycle_obligations_cycle_id').on(table.budgetCycleId),
    index('idx_cycle_obligations_ownership_id').on(table.ownershipId),
    index('idx_cycle_obligations_status').on(table.budgetCycleId, table.status),
  ],
);
