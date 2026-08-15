import { Injectable } from '@nestjs/common';
import { eq } from '@syndic-pro/db';
import { user } from '@syndic-pro/db/schema';

import { UpdateUserDto } from './dto/update-user.dto';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class UsersService {
  constructor(private readonly database: DatabaseService) {}

  async findOne(id: string) {
    return this.database.db.query.user.findFirst({ where: eq(user.id, id) });
  }

  async update(id: string, dto: UpdateUserDto) {
    const [updated] = await this.database.db
      .update(user)
      .set(dto)
      .where(eq(user.id, id))
      .returning();
    return updated;
  }
}
