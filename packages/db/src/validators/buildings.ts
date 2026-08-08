import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';
import { buildings } from '../schema/buildings.js';
import { dateAsIsoString } from './helpers/date-string.js';

export const selectBuildingSchema = createSelectSchema(buildings, {
  createdAt: () => dateAsIsoString,
  updatedAt: () => dateAsIsoString,
});
export const buildingResponseSchema = selectBuildingSchema;

export const insertBuildingSchema = createInsertSchema(buildings, {
  name: (schema) => schema.min(1).max(150),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateBuildingSchema = createUpdateSchema(buildings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
