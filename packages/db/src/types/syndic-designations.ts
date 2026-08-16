import { z } from 'zod';
import {
  insertSyndicDesignationsSchema,
  selectSyndicDesignationsSchema,
  updateSyndicDesignationsSchema,
} from '../validators/syndic-designations.js';

export type SyndicDesignation = z.infer<typeof selectSyndicDesignationsSchema>;

export type NewSyndicDesignation = z.infer<
  typeof insertSyndicDesignationsSchema
>;

export type UpdateSyndicDesignation = z.infer<
  typeof updateSyndicDesignationsSchema
>;
