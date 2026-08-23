import { z } from 'zod';
import { isoDateTime } from './common.js';
import { unitTypeSchema } from './enums.js';

export const createUnitSchema = z.object({
  propertyId: z.number().int().positive(),
  label: z.string().min(1).max(30),
  floor: z.string().max(30).optional(),
  type: unitTypeSchema.default('residential'),
  weightCoefficient: z.number().positive().default(1),
  isActive: z.boolean().default(true),
});

export const updateUnitSchema = createUnitSchema.partial();

export const unitResponseSchema = z.object({
  id: z.number(),
  propertyId: z.number(),
  label: z.string(),
  floor: z.string().nullable(),
  type: unitTypeSchema,
  weightCoefficient: z.number(),
  isActive: z.boolean(),
  createdAt: isoDateTime,
  updatedAt: isoDateTime,
});

export const onboardingUnitSchema = createUnitSchema.omit({
  propertyId: true,
  isActive: true,
});

export const onboardingUnitsFormSchema = z.object({
  units: z.array(onboardingUnitSchema).min(1).max(50),
});
