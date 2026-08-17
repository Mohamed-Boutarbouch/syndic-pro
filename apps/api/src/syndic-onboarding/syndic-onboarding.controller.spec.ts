import { Test, TestingModule } from '@nestjs/testing';
import { SyndicOnboardingController } from './syndic-onboarding.controller';
import { SyndicOnboardingService } from './syndic-onboarding.service';

describe('SyndicOnboardingController', () => {
  let controller: SyndicOnboardingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SyndicOnboardingController],
      providers: [SyndicOnboardingService],
    }).compile();

    controller = module.get<SyndicOnboardingController>(SyndicOnboardingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
