import { createZodDto } from 'nestjs-zod';
import { updateUnitSchema } from '@syndic-pro/validators';

export class UpdateUnitDto extends createZodDto(updateUnitSchema) {}
