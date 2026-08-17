import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UsePipes,
} from '@nestjs/common';
import { Session, type UserSession } from '@thallesp/nestjs-better-auth';
import {
  onboardingPayloadSchema,
  type OnboardingPayload,
} from '@syndic-pro/db/validators';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe.js';
import { SyndicOnboardingService } from './syndic-onboarding.service';
import { CreateSyndicOnboardingDto } from './dto/create-syndic-onboarding.dto';

@ApiTags('syndic-onboarding')
@Controller('syndic-onboarding')
export class SyndicOnboardingController {
  constructor(
    private readonly syndicOnboardingService: SyndicOnboardingService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a property with its full onboarding payload',
  })
  @ApiBody({ type: CreateSyndicOnboardingDto })
  @UsePipes(new ZodValidationPipe(onboardingPayloadSchema))
  async create(
    @Body() payload: OnboardingPayload,
    @Session() session: UserSession,
  ) {
    return this.syndicOnboardingService.createFromOnboarding(
      payload,
      session.user.id,
    );
  }

  @Get()
  findAll() {
    return this.syndicOnboardingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.syndicOnboardingService.findOne(+id);
  }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateSyndicOnboardingDto: UpdateSyndicOnboardingDto,
  // ) {
  //   return this.syndicOnboardingService.update(+id, updateSyndicOnboardingDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.syndicOnboardingService.remove(+id);
  }
}
