import { createZodDto } from 'nestjs-zod';
import { onboardingPayloadSchema } from '@syndic-pro/db/validators';

export class CreateSyndicOnboardingDto extends createZodDto(
  onboardingPayloadSchema,
) {}
