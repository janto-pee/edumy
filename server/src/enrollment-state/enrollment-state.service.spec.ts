import { Test, TestingModule } from '@nestjs/testing';
import { EnrollmentStateService } from './enrollment-state.service';

describe('EnrollmentStateService', () => {
  let service: EnrollmentStateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EnrollmentStateService],
    }).compile();

    service = module.get<EnrollmentStateService>(EnrollmentStateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
