import { z } from 'zod';
import { isoDateTime } from './common.js';

export const createPropertySchema = z.object({
  name: z.string().min(1).max(200),
  address: z.string().optional(),
  city: z.string().min(1).max(100),
  postalCode: z.string().max(20).optional(),
  countryCode: z.string().length(2).optional(),
});

export const updatePropertySchema = createPropertySchema.partial();

export const propertyResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  address: z.string().nullable(),
  city: z.string(),
  postalCode: z.string().nullable(),
  countryCode: z.string().nullable(),
  isActive: z.boolean(),
  createdAt: isoDateTime,
  updatedAt: isoDateTime,
});
