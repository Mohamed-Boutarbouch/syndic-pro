import { index, text, integer, numeric, unique } from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';
import { baseId, timestamps } from './helpers/columns.js';
import { paymentSchedules } from './payment-schedules.js';
import { user } from './auth/index.js';

export const paymentCoPayers = pgTable(
  'payment_co_payers',
  {
    ...baseId,
    paymentScheduleId: integer('payment_schedule_id')
      .notNull()
      .references(() => paymentSchedules.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'restrict' }),
    expectedShare: numeric('expected_share', {
      precision: 12,
      scale: 2,
      mode: 'number',
    }).notNull(),
    ...timestamps,
  },
  (table) => [
    unique('payment_co_payers_unique_user_per_schedule').on(
      table.paymentScheduleId,
      table.userId,
    ),
    index('idx_payment_co_payers_schedule_id').on(table.paymentScheduleId),
    index('idx_payment_co_payers_user_id').on(table.userId),
  ],
);
