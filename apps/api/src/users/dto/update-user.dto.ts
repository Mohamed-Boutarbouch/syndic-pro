import { createZodDto } from 'nestjs-zod';
import { updateAuthSchema } from '@syndic-pro/db';

export class UpdateUserDto extends createZodDto(updateAuthSchema) {}
