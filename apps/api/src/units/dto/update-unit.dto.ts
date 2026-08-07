import { createZodDto } from 'nestjs-zod';
import { updateUnitSchema } from '@syndic-pro/db/validators';

export class UpdateUnitDto extends createZodDto(updateUnitSchema) {}
