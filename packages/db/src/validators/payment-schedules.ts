import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';
import { paymentSchedules } from '../schema/payment-schedules.js';
import { withoutServerColumns } from './shared/column-sets.js';
import { withDateRefinements } from './shared/date-refinements.js';

export const selectPaymentScheduleSchema = createSelectSchema(
  paymentSchedules,
  withDateRefinements(paymentSchedules),
);
export const paymentScheduleResponseSchema = selectPaymentScheduleSchema;

export const insertPaymentScheduleSchema = createInsertSchema(
  paymentSchedules,
  {
    amountDue: (schema) => schema.positive(),
  },
).omit(withoutServerColumns(paymentSchedules));

export const updatePaymentScheduleSchema = createUpdateSchema(
  paymentSchedules,
).omit(withoutServerColumns(paymentSchedules));
