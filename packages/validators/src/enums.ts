import { z } from 'zod';

export const unitTypeValues = [
  'residential',
  'commercial',
  'storage',
  'other',
] as const;
export const unitTypeSchema = z.enum(unitTypeValues);

export const billingFrequencyValues = [
  'monthly',
  'bimonthly',
  'quarterly',
  'semi_annual',
] as const;
export const billingFrequencySchema = z.enum(billingFrequencyValues);

export const obligationStatusValues = [
  'active',
  'departed',
  'waived',
  'completed',
] as const;
export const obligationStatusSchema = z.enum(obligationStatusValues);

export const scheduleStatusValues = [
  'pending',
  'partial',
  'paid',
  'overdue',
  'cancelled',
] as const;
export const scheduleStatusSchema = z.enum(scheduleStatusValues);

export const paymentMethodValues = [
  'cash',
  'bank_transfer',
  'cheque',
  'mobile_payment',
  'other',
] as const;
export const paymentMethodSchema = z.enum(paymentMethodValues);

export const adjustmentTypeValues = [
  'initial',
  'owner_joined',
  'owner_departed',
  'weight_change',
  'manual',
] as const;
export const adjustmentTypeSchema = z.enum(adjustmentTypeValues);

export const syndicEventValues = [
  'assigned',
  'resigned',
  'transferred',
] as const;
export const syndicEventSchema = z.enum(syndicEventValues);
