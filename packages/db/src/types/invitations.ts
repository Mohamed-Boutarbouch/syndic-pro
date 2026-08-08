import { z } from 'zod';
import {
  insertInvitationSchema,
  selectInvitationSchema,
  updateInvitationSchema,
} from '../validators/invitations.js';

export type Invitation = z.infer<typeof selectInvitationSchema>;
export type NewInvitation = z.infer<typeof insertInvitationSchema>;
export type UpdateInvitation = z.infer<typeof updateInvitationSchema>;
