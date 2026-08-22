import { z } from 'zod';
import { isoDateTime, isoDate } from './common.js';
import { budgetCycleStatusSchema } from './enums.js';

export const createAnnualTargetBudgetSchema = z
  .object({
    propertyId: z.number().int().positive(),
    startDate: isoDate,
    endDate: isoDate,
    totalBudget: z.number().positive(),
    status: budgetCycleStatusSchema.default('unlocked'),
    createdByUserId: z.string().optional(),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: 'endDate must be after startDate',
    path: ['endDate'],
  });

export const updateAnnualTargetBudgetSchema = z.object({
  propertyId: z.number().int().positive().optional(),
  startDate: isoDate.optional(),
  endDate: isoDate.optional(),
  totalBudget: z.number().positive().optional(),
  status: budgetCycleStatusSchema.optional(),
  createdByUserId: z.string().optional(),
});

export const annualTargetBudgetResponseSchema = z.object({
  id: z.number(),
  propertyId: z.number(),
  startDate: isoDate,
  endDate: isoDate,
  totalBudget: z.number(),
  status: budgetCycleStatusSchema,
  createdByUserId: z.string().nullable(),
  createdAt: isoDateTime,
  updatedAt: isoDateTime,
});
