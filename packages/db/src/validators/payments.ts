import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';
import { payments } from '../schema/payments.js';
import { withoutServerColumns } from './shared/column-sets.js';
import { withDateRefinements } from './shared/date-refinements.js';

export const selectPaymentSchema = createSelectSchema(
  payments,
  withDateRefinements(payments),
);
export const paymentResponseSchema = selectPaymentSchema;

export const insertPaymentSchema = createInsertSchema(payments, {
  amount: (schema) => schema.positive(),
}).omit(withoutServerColumns(payments));

export const updatePaymentSchema = createUpdateSchema(payments).omit(
  withoutServerColumns(payments),
);
