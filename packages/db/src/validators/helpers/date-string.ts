import { z } from 'zod';

export const dateAsIsoString = z.iso.datetime();
