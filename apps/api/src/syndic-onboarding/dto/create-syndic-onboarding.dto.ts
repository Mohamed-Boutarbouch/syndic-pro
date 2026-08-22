import { createZodDto } from 'nestjs-zod';
import { onboardingPayloadSchema } from '@syndic-pro/validators';

export class CreateSyndicOnboardingDto extends createZodDto(
  onboardingPayloadSchema,
) {}
