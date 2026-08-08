import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';
import { z } from 'zod';
import { invitations } from '../schema/invitations.js';
import { withoutServerColumns } from './shared/column-sets.js';
import { withDateRefinements } from './shared/date-refinements.js';

export const selectInvitationSchema = createSelectSchema(
  invitations,
  withDateRefinements(invitations),
);
export const invitationResponseSchema = selectInvitationSchema;

export const insertInvitationSchema = createInsertSchema(invitations, {
  email: () => z.email(),
  token: (schema) => schema.length(64),
}).omit(withoutServerColumns(invitations));

export const updateInvitationSchema = createUpdateSchema(invitations).omit(
  withoutServerColumns(invitations),
);
