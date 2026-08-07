import { Injectable, NotFoundException } from '@nestjs/common';
import { eq } from '@syndic-pro/db';
import { units } from '@syndic-pro/db/schema';
import { type NewUnit, type UpdateUnit } from '@syndic-pro/db/types';

import { DatabaseService } from '../database/database.service';

@Injectable()
export class UnitsService {
  constructor(private readonly database: DatabaseService) {}

  async create(dto: NewUnit) {
    const [unit] = await this.database.db.insert(units).values(dto).returning();

    return unit;
  }

  async findOne(id: string) {
    return this.findUnitOrThrow(id);
  }

  async update(id: string, dto: UpdateUnit) {
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

  async remove(id: string) {
    const [unit] = await this.database.db
      .delete(units)
      .where(eq(units.id, id))
      .returning();

    if (!unit) {
      throw new NotFoundException(`Unit '${id}' not found.`);
    }

    return unit;
  }

  private async findUnitOrThrow(id: string) {
    const unit = await this.database.db.query.units.findFirst({
      where: (unit, { eq }) => eq(unit.id, id),
      with: {
        building: true,
      },
    });

    if (!unit) {
      throw new NotFoundException(`Unit '${id}' not found.`);
    }

    return unit;
  }
}
