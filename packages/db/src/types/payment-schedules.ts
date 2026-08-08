import { z } from 'zod';
import {
  insertPaymentScheduleSchema,
  selectPaymentScheduleSchema,
  updatePaymentScheduleSchema,
} from '../validators/payment-schedules.js';

export type PaymentSchedule = z.infer<typeof selectPaymentScheduleSchema>;
export type NewPaymentSchedule = z.infer<typeof insertPaymentScheduleSchema>;
export type UpdatePaymentSchedule = z.infer<typeof updatePaymentScheduleSchema>;
