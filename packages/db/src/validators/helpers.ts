import { z } from 'zod';

export const dateAsIsoString = z.iso.datetime();

export const SERVER_OMIT = {
  id: true,
  createdAt: true,
  updatedAt: true,
} as const;
