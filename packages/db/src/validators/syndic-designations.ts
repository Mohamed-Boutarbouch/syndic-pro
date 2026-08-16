import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';
import { syndicDesignations } from '../schema/syndic-designations.js';
import { dateAsIsoString, SERVER_OMIT } from './helpers.js';

export const selectSyndicDesignationsSchema = createSelectSchema(
  syndicDesignations,
  {
    createdAt: dateAsIsoString,
    updatedAt: dateAsIsoString,
  },
);
export const syndicDesignationsResponseSchema = selectSyndicDesignationsSchema;

export const insertSyndicDesignationsSchema =
  createInsertSchema(syndicDesignations).omit(SERVER_OMIT);

export const updateSyndicDesignationsSchema =
  createUpdateSchema(syndicDesignations).omit(SERVER_OMIT);
