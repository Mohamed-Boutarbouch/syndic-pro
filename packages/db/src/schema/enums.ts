import { pgEnum } from 'drizzle-orm/pg-core';

export const unitType = pgEnum('unit_type', [
  'residential',
  'commercial',
  'storage',
  'other',
]);

export const budgetCycleStatus = pgEnum('budget_cycle_status', [
  'locked',
  'unlocked',
]);

export const obligationStatus = pgEnum('obligation_status', [
  'active',
  'departed',
  'waived',
  'completed',
]);

export const scheduleStatus = pgEnum('schedule_status', [
  'pending',
  'partial',
  'paid',
  'overdue',
  'cancelled',
]);

export const paymentMethod = pgEnum('payment_method', [
  'cash',
  'bank_transfer',
  'cheque',
  'mobile_payment',
  'other',
]);

export const adjustmentType = pgEnum('adjustment_type', [
  'initial',
  'owner_joined',
  'owner_departed',
  'weight_change',
  'manual',
]);

export const syndicEvent = pgEnum('syndic_event', [
  'assigned',
  'resigned',
  'transferred',
]);
