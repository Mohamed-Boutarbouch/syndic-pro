import {
  date,
  index,
  integer,
  numeric,
  text,
  varchar,
  timestamp,
  unique,
} from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';
import { baseId, timestamps } from './helpers/columns.js';
import { budgetCycleStatus } from './enums.js';
import { properties } from './properties.js';
import { users } from './users.js';

export const budgetCycles = pgTable(
  'budget_cycles',
  {
    ...baseId,
    propertyId: integer('property_id')
      .notNull()
      .references(() => properties.id, { onDelete: 'restrict' }),
    label: varchar('label', { length: 50 }).notNull(),
    startMonth: date('start_month', { mode: 'date' }).notNull(),
    endMonth: date('end_month', { mode: 'date' }).notNull(),
    totalBudget: numeric('total_budget', {
      precision: 12,
      scale: 2,
      mode: 'number',
    }).notNull(),
    status: budgetCycleStatus('status').notNull().default('draft'),
    snapshotDate: date('snapshot_date', { mode: 'date' }),
    activatedByUserId: integer('activated_by_user_id').references(
      () => users.id,
      {
        onDelete: 'set null',
      },
    ),
    activatedAt: timestamp('activated_at', {
      mode: 'date',
      withTimezone: true,
    }),
    closedAt: timestamp('closed_at', { mode: 'date', withTimezone: true }),
    notes: text('notes'),
    ...timestamps,
  },
  (table) => [
    unique('budget_cycles_unique_label_per_property').on(
      table.propertyId,
      table.label,
    ),
    index('idx_budget_cycles_property_id').on(table.propertyId),
    index('idx_budget_cycles_status').on(table.propertyId, table.status),
  ],
);
