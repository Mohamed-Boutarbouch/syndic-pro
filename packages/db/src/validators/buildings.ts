import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';
import { buildings } from '../schema/buildings.js';

export const selectBuildingSchema = createSelectSchema(buildings);
export const buildingResponseSchema = selectBuildingSchema;

export const insertBuildingSchema = createInsertSchema(buildings, {
  name: (schema) => schema.min(1).max(150),
}).omit({
  id: true,
  createdAt: true,
});

export const updateBuildingSchema = createUpdateSchema(buildings).omit({
  id: true,
  createdAt: true,
});
