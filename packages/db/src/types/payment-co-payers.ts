import { z } from 'zod';
import {
  insertPaymentCoPayerSchema,
  selectPaymentCoPayerSchema,
  updatePaymentCoPayerSchema,
} from '../validators/payment-co-payers.js';

export type PaymentCoPayer = z.infer<typeof selectPaymentCoPayerSchema>;
export type NewPaymentCoPayer = z.infer<typeof insertPaymentCoPayerSchema>;
export type UpdatePaymentCoPayer = z.infer<typeof updatePaymentCoPayerSchema>;
