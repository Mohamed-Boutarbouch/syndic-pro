import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';
import { cycleAdjustments } from '../schema/cycle-adjustments.js';
import { dateAsIsoString, SERVER_OMIT } from './helpers.js';

export const selectCycleAdjustmentSchema = createSelectSchema(
  cycleAdjustments,
  {
    createdAt: dateAsIsoString,
    updatedAt: dateAsIsoString,
  },
);
export const cycleAdjustmentResponseSchema = selectCycleAdjustmentSchema;

export const insertCycleAdjustmentSchema = createInsertSchema(
  cycleAdjustments,
  {
    reason: (schema) => schema.min(1),
  },
).omit(SERVER_OMIT);

export const updateCycleAdjustmentSchema = createUpdateSchema(
  cycleAdjustments,
  {
    reason: (schema) => schema.min(1),
  },
).omit(SERVER_OMIT);
