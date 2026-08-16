import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';
import { z } from 'zod';
import { cycleObligations } from '../schema/cycle-obligations.js';
import { dateAsIsoString, SERVER_OMIT } from './helpers.js';

export const selectCycleObligationSchema = createSelectSchema(
  cycleObligations,
  {
    createdAt: dateAsIsoString,
    updatedAt: dateAsIsoString,
  },
);
export const cycleObligationResponseSchema = selectCycleObligationSchema;

const obligationRefinement = {
  shareAmount: (schema: z.ZodNumber) => schema.positive(),
  baseMonthlyRate: (schema: z.ZodNumber) => schema.positive(),
  snapshotContributionWeight: (schema: z.ZodNumber) => schema.positive(),
  paymentIntervalMonths: (schema: z.ZodNumber) =>
    schema.refine((v) => [1, 2, 3, 6].includes(v), {
      message: 'paymentIntervalMonths must be one of 1, 2, 3, 6',
    }),
};

export const insertCycleObligationSchema = createInsertSchema(
  cycleObligations,
  obligationRefinement,
).omit(SERVER_OMIT);

export const updateCycleObligationSchema = createUpdateSchema(
  cycleObligations,
  obligationRefinement,
).omit(SERVER_OMIT);
