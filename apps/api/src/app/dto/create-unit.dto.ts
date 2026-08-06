import { createZodDto } from 'nestjs-zod';
import { insertUnitSchema } from '@syndic-pro/db/schema';

export class CreateUnitDto extends createZodDto(insertUnitSchema) {}
