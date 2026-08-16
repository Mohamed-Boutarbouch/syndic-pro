import { z } from 'zod';
import {
  selectUnitCoOwnerSchema,
  insertUnitCoOwnerSchema,
  updateUnitCoOwnerSchema,
} from '../validators/unit-co-owners.js';

export type UnitCoOwner = z.infer<typeof selectUnitCoOwnerSchema>;
export type NewUnitCoOwner = z.infer<typeof insertUnitCoOwnerSchema>;
export type UpdateUnitCoOwner = z.infer<typeof updateUnitCoOwnerSchema>;
