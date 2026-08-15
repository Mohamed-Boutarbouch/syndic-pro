import { createZodDto } from 'nestjs-zod';
import { insertAuthSchema } from '@syndic-pro/db';

export class CreateUserDto extends createZodDto(insertAuthSchema) {}
