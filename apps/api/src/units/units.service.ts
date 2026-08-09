import { Injectable, NotFoundException } from '@nestjs/common';
import { eq } from '@syndic-pro/db';
import { units } from '@syndic-pro/db/schema';

import { DatabaseService } from '../database/database.service';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';

@Injectable()
export class UnitsService {
  constructor(private readonly database: DatabaseService) {}

  async create(dto: CreateUnitDto) {
    const [unit] = await this.database.db.insert(units).values(dto).returning();

    return unit;
  }

  async findOne(id: number) {
    return this.findUnitOrThrow(id);
  }

  async update(id: number, dto: UpdateUnitDto) {
    const [unit] = await this.database.db
      .update(units)
      .set(dto)
      .where(eq(units.id, id))
      .returning();

    if (!unit) {
      throw new NotFoundException(`Unit '${id}' not found.`);
    }

    return unit;
  }

  async remove(id: number) {
    const [unit] = await this.database.db
      .delete(units)
      .where(eq(units.id, id))
      .returning();

    if (!unit) {
      throw new NotFoundException(`Unit '${id}' not found.`);
    }

    return unit;
  }

  private async findUnitOrThrow(id: number) {
    const unit = await this.database.db.query.units.findFirst({
      where: (unit, { eq }) => eq(unit.id, id),
    });

    if (!unit) {
      throw new NotFoundException(`Unit '${id}' not found.`);
    }

    return unit;
  }
}
