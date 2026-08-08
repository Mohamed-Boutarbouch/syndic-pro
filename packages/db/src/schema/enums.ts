import { pgEnum } from 'drizzle-orm/pg-core';

export const tenantPlan = pgEnum('tenant_plan', [
  'starter',
  'pro',
  'enterprise',
]);

export const tenantUserRole = pgEnum('tenant_user_role', ['admin', 'member']);

export const unitType = pgEnum('unit_type', [
  'residential',
  'commercial',
  'storage',
  'parking',
  'other',
]);

export const budgetCycleStatus = pgEnum('budget_cycle_status', [
  'draft',
  'active',
  'closed',
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
