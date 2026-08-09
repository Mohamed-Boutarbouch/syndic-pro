import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';
import { z } from 'zod';
import { invitations } from '../schema/invitations.js';
import { dateAsIsoString, SERVER_OMIT } from './helpers.js';

export const selectInvitationSchema = createSelectSchema(invitations, {
  createdAt: dateAsIsoString,
  updatedAt: dateAsIsoString,
});
export const invitationResponseSchema = selectInvitationSchema;

export const insertInvitationSchema = createInsertSchema(invitations, {
  email: () => z.email(),
  token: (schema) => schema.length(64),
}).omit(SERVER_OMIT);

export const updateInvitationSchema = createUpdateSchema(invitations, {
  email: () => z.email(),
  token: (schema) => schema.length(64),
}).omit(SERVER_OMIT);
