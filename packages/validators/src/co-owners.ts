import { z } from 'zod';
import { isoDateTime } from './common.js';

export const createCoOwnerSchema = z.object({
  name: z.string().min(1).max(150),
  email: z.email().optional(),
  phone: z.string().optional(),
  userId: z.string().optional(),
  isActive: z.boolean().default(true),
});

export const updateCoOwnerSchema = createCoOwnerSchema.partial();

export const coOwnerResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().nullable(),
  phone: z.string().nullable(),
  userId: z.string().nullable(),
  isActive: z.boolean(),
  createdAt: isoDateTime,
  updatedAt: isoDateTime,
});
