import { z } from 'zod';
import {
  signUpSchema,
  signInSchema,
  updateAuthSchema,
  userResponseSchema,
} from '@syndic-pro/validators';

export type SignUp = z.infer<typeof signUpSchema>;
export type SignIn = z.infer<typeof signInSchema>;
export type UpdateAuth = z.infer<typeof updateAuthSchema>;
export type UserResponse = z.infer<typeof userResponseSchema>;
