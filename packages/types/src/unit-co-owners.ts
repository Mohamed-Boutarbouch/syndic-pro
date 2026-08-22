import { z } from 'zod';
import {
  createUnitCoOwnerSchema,
  updateUnitCoOwnerSchema,
  unitCoOwnerResponseSchema,
} from '@syndic-pro/validators';

export type CreateUnitCoOwner = z.infer<typeof createUnitCoOwnerSchema>;
export type UpdateUnitCoOwner = z.infer<typeof updateUnitCoOwnerSchema>;
export type UnitCoOwnerResponse = z.infer<typeof unitCoOwnerResponseSchema>;
