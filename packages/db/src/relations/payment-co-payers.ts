import { relations } from 'drizzle-orm';
import { paymentCoPayers } from '../schema/payment-co-payers.js';
import { paymentSchedules } from '../schema/payment-schedules.js';
import { users } from '../schema/users.js';

export const paymentCoPayersRelations = relations(
  paymentCoPayers,
  ({ one }) => ({
    paymentSchedule: one(paymentSchedules, {
      fields: [paymentCoPayers.paymentScheduleId],
      references: [paymentSchedules.id],
    }),
    user: one(users, {
      fields: [paymentCoPayers.userId],
      references: [users.id],
    }),
  }),
);
