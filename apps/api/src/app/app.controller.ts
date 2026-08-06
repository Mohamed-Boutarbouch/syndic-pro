import { Body, Controller, Get, Post, UsePipes } from '@nestjs/common';
import { AppService } from './app.service';
import { insertUnitSchema, type NewUnit } from '@syndic-pro/db/schema';
import { ZodValidationPipe } from '../common/zod-validation.pipe';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Post()
  @UsePipes(new ZodValidationPipe(insertUnitSchema))
  create(@Body() body: NewUnit) {
    console.log(body);
  }
}
