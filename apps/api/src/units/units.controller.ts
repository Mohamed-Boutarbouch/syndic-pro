import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
} from '@nestjs/common';
import { insertUnitSchema, updateUnitSchema } from '@syndic-pro/db/validators';
import { ZodValidationPipe } from '../common/zod-validation.pipe';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { UnitsService } from './units.service';
import { CreateUnitDto } from './dto/create-unit.dto';

@Controller('units')
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(insertUnitSchema))
  async create(@Body() body: CreateUnitDto) {
    return await this.unitsService.create(body);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    console.log('id: ', id);
    return await this.unitsService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(new ZodValidationPipe(updateUnitSchema))
  async update(@Param('id') id: string, @Body() body: UpdateUnitDto) {
    return await this.unitsService.update(id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.unitsService.remove(id);
  }
}
