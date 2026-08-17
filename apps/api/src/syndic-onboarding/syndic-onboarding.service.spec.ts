import { Test, TestingModule } from '@nestjs/testing';
import { SyndicOnboardingService } from './syndic-onboarding.service';

describe('SyndicOnboardingService', () => {
  let service: SyndicOnboardingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SyndicOnboardingService],
    }).compile();

    service = module.get<SyndicOnboardingService>(SyndicOnboardingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
