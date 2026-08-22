import { z } from 'zod';
import { isoDateTime } from './common.js';
import { billingFrequencySchema } from './enums.js';

export const createUnitCoOwnerSchema = z.object({
  unitId: z.number().int().positive(),
  coOwnerId: z.number().int().positive(),
  ownershipPercentage: z.number().min(0).max(100).optional(),
  billingFrequency: billingFrequencySchema.default('monthly'),
  isDesignatedSyndic: z.boolean().default(false),
});

export const updateUnitCoOwnerSchema = createUnitCoOwnerSchema.partial();

export const unitCoOwnerResponseSchema = z.object({
  id: z.number(),
  unitId: z.number(),
  coOwnerId: z.number(),
  ownershipPercentage: z.number().nullable(),
  billingFrequency: billingFrequencySchema,
  isDesignatedSyndic: z.boolean(),
  createdAt: isoDateTime,
  updatedAt: isoDateTime,
});
