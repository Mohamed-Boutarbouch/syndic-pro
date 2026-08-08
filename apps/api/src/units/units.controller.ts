import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { insertUnitSchema, updateUnitSchema } from '@syndic-pro/db/validators';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { UnitsService } from './units.service';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { UnitResponseDto } from './dto/unit-response.dto';

@ApiTags('units')
@Controller('units')
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a unit' })
  @ApiBody({ type: CreateUnitDto })
  @ApiOkResponse({ type: UnitResponseDto })
  async create(
    @Body(new ZodValidationPipe(insertUnitSchema)) body: CreateUnitDto,
  ) {
    return this.unitsService.create(body);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a unit by id' })
  @ApiParam({ name: 'id', type: String, format: 'uuid' })
  @ApiOkResponse({ type: UnitResponseDto })
  async findOne(@Param('id') id: string) {
    return this.unitsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a unit' })
  @ApiParam({ name: 'id', type: String, format: 'uuid' })
  @ApiBody({ type: UpdateUnitDto })
  @ApiOkResponse({ type: UnitResponseDto })
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateUnitSchema)) body: UpdateUnitDto,
  ) {
    return this.unitsService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a unit' })
  @ApiParam({ name: 'id', type: String, format: 'uuid' })
  @ApiOkResponse({ type: UnitResponseDto })
  async remove(@Param('id') id: string) {
    return this.unitsService.remove(id);
  }
}
