import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';
import { paymentCoPayers } from '../schema/payment-co-payers.js';
import { withoutServerColumns } from './shared/column-sets.js';
import { withDateRefinements } from './shared/date-refinements.js';

export const selectPaymentCoPayerSchema = createSelectSchema(
  paymentCoPayers,
  withDateRefinements(paymentCoPayers),
);
export const paymentCoPayerResponseSchema = selectPaymentCoPayerSchema;

export const insertPaymentCoPayerSchema = createInsertSchema(
  paymentCoPayers,
  {
    expectedShare: (schema) => schema.positive(),
  },
).omit(withoutServerColumns(paymentCoPayers));

export const updatePaymentCoPayerSchema = createUpdateSchema(
  paymentCoPayers,
).omit(withoutServerColumns(paymentCoPayers));
