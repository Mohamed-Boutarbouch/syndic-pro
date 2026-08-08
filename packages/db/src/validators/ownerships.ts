import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';
import { ownerships } from '../schema/ownerships.js';
import { withoutServerColumns } from './shared/column-sets.js';
import { withDateRefinements } from './shared/date-refinements.js';

export const selectOwnershipSchema = createSelectSchema(
  ownerships,
  withDateRefinements(ownerships),
);
export const ownershipResponseSchema = selectOwnershipSchema;

export const insertOwnershipSchema = createInsertSchema(ownerships).omit(
  withoutServerColumns(ownerships),
);

export const updateOwnershipSchema = createUpdateSchema(ownerships).omit(
  withoutServerColumns(ownerships),
);
