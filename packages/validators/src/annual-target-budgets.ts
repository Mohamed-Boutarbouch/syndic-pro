import { z } from 'zod';
import { isoDateTime, isoDate } from './common.js';

export const createAnnualTargetBudgetSchema = z
  .object({
    propertyId: z.number().int().positive(),
    startDate: isoDate,
    endDate: isoDate,
    totalBudget: z.number().positive(),
    isBudgetLocked: z.boolean(),
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
  isBudgetLocked: z.boolean().optional(),
  createdByUserId: z.string().optional(),
});

export const annualTargetBudgetResponseSchema = z.object({
  id: z.number(),
  propertyId: z.number(),
  startDate: isoDate,
  endDate: isoDate,
  totalBudget: z.number(),
  isBudgetLocked: z.boolean(),
  createdByUserId: z.string().nullable(),
  createdAt: isoDateTime,
  updatedAt: isoDateTime,
});
