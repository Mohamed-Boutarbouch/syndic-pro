import { z } from 'zod';
import { isoDateTime } from './common.js';

export const signUpSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.email(),
  password: z.string().min(8).max(100),
});

export const signInSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export const updateAuthSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  phone: z.string().optional(),
  locale: z.string().optional(),
  image: z.url().optional(),
});

export const userResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
  emailVerified: z.boolean(),
  image: z.string().nullable(),
  phone: z.string().nullable(),
  locale: z.string().nullable(),
  isActive: z.boolean(),
  createdAt: isoDateTime,
  updatedAt: isoDateTime,
});
