import {
  index,
  integer,
  numeric,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';
import { baseId, timestamps } from './helpers/columns.js';
import { paymentMethod } from './enums.js';
import { cycleObligations } from './cycle-obligations.js';
import { paymentSchedules } from './payment-schedules.js';
import { users } from './users.js';

export const payments = pgTable(
  'payments',
  {
    ...baseId,
    cycleObligationId: integer('cycle_obligation_id')
      .notNull()
      .references(() => cycleObligations.id, { onDelete: 'restrict' }),
    paymentScheduleId: integer('payment_schedule_id').references(
      () => paymentSchedules.id,
      { onDelete: 'restrict' },
    ),
    paidByUserId: integer('paid_by_user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    recordedByUserId: integer('recorded_by_user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    amount: numeric('amount', {
      precision: 12,
      scale: 2,
      mode: 'number',
    }).notNull(),
    paidAt: timestamp('paid_at', { mode: 'date', withTimezone: true })
      .notNull()
      .defaultNow(),
    method: paymentMethod('method').notNull().default('cash'),
    reference: varchar('reference', { length: 100 }),
    notes: text('notes'),
    voidedAt: timestamp('voided_at', { mode: 'date', withTimezone: true }),
    voidedByUserId: integer('voided_by_user_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    voidReason: text('void_reason'),
    ...timestamps,
  },
  (table) => [
    index('idx_payments_obligation_id').on(table.cycleObligationId),
    index('idx_payments_schedule_id').on(table.paymentScheduleId),
    index('idx_payments_paid_by').on(table.paidByUserId),
    index('idx_payments_paid_at').on(table.paidAt),
  ],
);
