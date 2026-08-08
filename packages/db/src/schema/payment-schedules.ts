import {
  boolean,
  date,
  index,
  integer,
  numeric,
  smallint,
  unique,
} from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';
import { baseId, timestamps } from './helpers/columns.js';
import { scheduleStatus } from './enums.js';
import { cycleObligations } from './cycle-obligations.js';

export const paymentSchedules = pgTable(
  'payment_schedules',
  {
    ...baseId,
    cycleObligationId: integer('cycle_obligation_id')
      .notNull()
      .references(() => cycleObligations.id, { onDelete: 'restrict' }),
    installmentNumber: smallint('installment_number').notNull(),
    dueDate: date('due_date', { mode: 'date' }).notNull(),
    amountDue: numeric('amount_due', {
      precision: 12,
      scale: 2,
      mode: 'number',
    }).notNull(),
    isFinalInstallment: boolean('is_final_installment')
      .notNull()
      .default(false),
    status: scheduleStatus('status').notNull().default('pending'),
    ...timestamps,
  },
  (table) => [
    unique('payment_schedules_unique_installment').on(
      table.cycleObligationId,
      table.installmentNumber,
    ),
    index('idx_payment_schedules_obligation_id').on(table.cycleObligationId),
    index('idx_payment_schedules_due_date').on(table.dueDate, table.status),
    index('idx_payment_schedules_status').on(table.status),
  ],
);
