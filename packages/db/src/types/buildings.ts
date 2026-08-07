import type { z } from 'zod';
import type {
  insertBuildingSchema,
  selectBuildingSchema,
  updateBuildingSchema,
} from '../validators/buildings.js';

export type Building = z.infer<typeof selectBuildingSchema>;
export type NewBuilding = z.infer<typeof insertBuildingSchema>;
export type UpdateBuilding = z.infer<typeof updateBuildingSchema>;
