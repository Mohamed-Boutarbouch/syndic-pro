import { createZodDto } from 'nestjs-zod';
import { createUnitSchema } from '@syndic-pro/validators';

export class CreateUnitDto extends createZodDto(createUnitSchema) {}
