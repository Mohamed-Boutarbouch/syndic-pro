import { z } from 'zod';
import {
  selectUnitOwnershipsSchema,
  insertUnitOwnershipsSchema,
  updateUnitOwnershipsSchema,
} from '../validators/unit-ownerships.js';

export type UnitOwnerships = z.infer<typeof selectUnitOwnershipsSchema>;
export type NewUnitOwnerships = z.infer<typeof insertUnitOwnershipsSchema>;
export type UpdateUnitOwnerships = z.infer<typeof updateUnitOwnershipsSchema>;
