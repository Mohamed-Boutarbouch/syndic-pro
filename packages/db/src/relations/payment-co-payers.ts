import { relations } from 'drizzle-orm';
import { paymentCoPayers } from '../schema/payment-co-payers.js';
import { paymentSchedules } from '../schema/payment-schedules.js';
import { user } from '../schema/auth/index.js';

export const paymentCoPayersRelations = relations(
  paymentCoPayers,
  ({ one }) => ({
    paymentSchedule: one(paymentSchedules, {
      fields: [paymentCoPayers.paymentScheduleId],
      references: [paymentSchedules.id],
    }),
    user: one(user, {
      fields: [paymentCoPayers.userId],
      references: [user.id],
    }),
  }),
);
