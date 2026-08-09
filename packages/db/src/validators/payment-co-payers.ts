import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';
import { paymentCoPayers } from '../schema/payment-co-payers.js';
import { dateAsIsoString, SERVER_OMIT } from './helpers.js';

export const selectPaymentCoPayerSchema = createSelectSchema(paymentCoPayers, {
  createdAt: dateAsIsoString,
  updatedAt: dateAsIsoString,
});
export const paymentCoPayerResponseSchema = selectPaymentCoPayerSchema;

export const insertPaymentCoPayerSchema = createInsertSchema(paymentCoPayers, {
  expectedShare: (schema) => schema.positive(),
}).omit(SERVER_OMIT);

export const updatePaymentCoPayerSchema = createUpdateSchema(paymentCoPayers, {
  expectedShare: (schema) => schema.positive(),
}).omit(SERVER_OMIT);
