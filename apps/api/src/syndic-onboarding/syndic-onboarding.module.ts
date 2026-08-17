import { Module } from '@nestjs/common';
import { SyndicOnboardingService } from './syndic-onboarding.service';
import { SyndicOnboardingController } from './syndic-onboarding.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [SyndicOnboardingController],
  providers: [SyndicOnboardingService],
})
export class SyndicOnboardingModule {}
