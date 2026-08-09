import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';
import { paymentSchedules } from '../schema/payment-schedules.js';
import { dateAsIsoString, SERVER_OMIT } from './helpers.js';

export const selectPaymentScheduleSchema = createSelectSchema(
  paymentSchedules,
  {
    createdAt: dateAsIsoString,
    updatedAt: dateAsIsoString,
  },
);
export const paymentScheduleResponseSchema = selectPaymentScheduleSchema;

export const insertPaymentScheduleSchema = createInsertSchema(
  paymentSchedules,
  {
    amountDue: (schema) => schema.positive(),
  },
).omit(SERVER_OMIT);

export const updatePaymentScheduleSchema = createUpdateSchema(
  paymentSchedules,
  {
    amountDue: (schema) => schema.positive(),
  },
).omit(SERVER_OMIT);
