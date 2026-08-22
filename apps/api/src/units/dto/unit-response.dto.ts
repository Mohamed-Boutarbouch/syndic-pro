import { createZodDto } from 'nestjs-zod';
import { unitResponseSchema } from '@syndic-pro/validators';

export class UnitResponseDto extends createZodDto(unitResponseSchema) {}
