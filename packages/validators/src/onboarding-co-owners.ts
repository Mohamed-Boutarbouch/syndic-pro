import { z } from 'zod';
import { billingFrequencySchema } from './enums.js';

export const BILLING_FREQUENCIES = billingFrequencySchema.options;

export const coOwnerItemSchema = z.object({
  unitClientId: z.string(),
  coOwnerName: z.string().min(1).max(150),
  coOwnerEmail: z.email().optional().or(z.literal('')),
  coOwnerPhone: z.string().optional(),
  billingFrequency: billingFrequencySchema.default('monthly'),
  designatedSyndic: z.boolean().default(false),
});

export const coOwnersSchema = z.object({
  coOwners: z.array(coOwnerItemSchema).min(1),
});
