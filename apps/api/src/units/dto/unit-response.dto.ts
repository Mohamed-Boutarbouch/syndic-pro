import { createZodDto } from 'nestjs-zod';
import { unitResponseSchema } from '@syndic-pro/db/validators';

export class UnitResponseDto extends createZodDto(unitResponseSchema) {}
