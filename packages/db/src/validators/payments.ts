import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';
import { payments } from '../schema/payments.js';
import { dateAsIsoString, SERVER_OMIT } from './helpers.js';

export const selectPaymentSchema = createSelectSchema(payments, {
  createdAt: dateAsIsoString,
  updatedAt: dateAsIsoString,
  paidAt: dateAsIsoString,
  voidedAt: dateAsIsoString.optional(),
});
export const paymentResponseSchema = selectPaymentSchema;

export const insertPaymentSchema = createInsertSchema(payments, {
  amount: (schema) => schema.positive(),
}).omit(SERVER_OMIT);

export const updatePaymentSchema = createUpdateSchema(payments, {
  amount: (schema) => schema.positive(),
}).omit(SERVER_OMIT);
