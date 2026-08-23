import {
  date,
  index,
  integer,
  numeric,
  pgTable,
  text,
  boolean,
} from 'drizzle-orm/pg-core';
import { baseId, timestamps } from './helpers/columns.js';
import { properties } from './properties.js';
import { user } from './auth/index.js';

export const annualTargetBudgets = pgTable(
  'annual_target_budgets',
  {
    ...baseId,
    propertyId: integer('property_id')
      .notNull()
      .references(() => properties.id, { onDelete: 'restrict' }),
    startDate: date('start_date', { mode: 'date' }).notNull(),
    endDate: date('end_date', { mode: 'date' }).notNull(),
    totalBudget: numeric('total_budget', {
      precision: 12,
      scale: 2,
      mode: 'number',
    }).notNull(),
    isBudgedLocked: boolean('is_budged_locked').default(false),
    createdByUserId: text('created_by_user_id').references(() => user.id, {
      onDelete: 'set null',
    }),
    ...timestamps,
  },
  (table) => [
    index('idx_annual_target_budgets_property_id').on(table.propertyId),
  ],
);
