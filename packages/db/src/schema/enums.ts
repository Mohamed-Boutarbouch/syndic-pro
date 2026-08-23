import { pgEnum } from 'drizzle-orm/pg-core';
import {
  unitTypeValues,
  billingFrequencyValues,
  obligationStatusValues,
  scheduleStatusValues,
  paymentMethodValues,
  adjustmentTypeValues,
  syndicEventValues,
} from '@syndic-pro/validators';

export const unitType = pgEnum('unit_type', unitTypeValues);
export const billingFrequency = pgEnum(
  'billing_frequency',
  billingFrequencyValues,
);
export const obligationStatus = pgEnum(
  'obligation_status',
  obligationStatusValues,
);
export const scheduleStatus = pgEnum('schedule_status', scheduleStatusValues);
export const paymentMethod = pgEnum('payment_method', paymentMethodValues);
export const adjustmentType = pgEnum('adjustment_type', adjustmentTypeValues);
export const syndicEvent = pgEnum('syndic_event', syndicEventValues);
