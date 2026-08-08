import { z } from 'zod';
import {
  insertPaymentSchema,
  selectPaymentSchema,
  updatePaymentSchema,
} from '../validators/payments.js';

export type Payment = z.infer<typeof selectPaymentSchema>;
export type NewPayment = z.infer<typeof insertPaymentSchema>;
export type UpdatePayment = z.infer<typeof updatePaymentSchema>;
