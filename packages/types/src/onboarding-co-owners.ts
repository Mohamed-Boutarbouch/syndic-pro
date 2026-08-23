import { z } from 'zod';
import { coOwnerItemSchema, coOwnersSchema } from '@syndic-pro/validators';

export type CoOwnerItemInput = z.input<typeof coOwnerItemSchema>;
export type CoOwnerItemOutput = z.output<typeof coOwnerItemSchema>;
export type OnboardingCoOwnersInput = z.input<typeof coOwnersSchema>;
export type OnboardingCoOwnersOutput = z.output<typeof coOwnersSchema>;
