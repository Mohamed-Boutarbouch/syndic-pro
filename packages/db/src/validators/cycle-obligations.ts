import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';
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

export const insertCycleObligationSchema = createInsertSchema(
  cycleObligations,
  {
    shareAmount: (schema) => schema.positive(),
    baseMonthlyRate: (schema) => schema.positive(),
  },
).omit(SERVER_OMIT);

export const updateCycleObligationSchema = createUpdateSchema(
  cycleObligations,
  {
    shareAmount: (schema) => schema.positive(),
    baseMonthlyRate: (schema) => schema.positive(),
  },
).omit(SERVER_OMIT);
