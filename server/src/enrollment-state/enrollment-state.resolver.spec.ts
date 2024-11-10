import { Test, TestingModule } from '@nestjs/testing';
import { EnrollmentStateResolver } from './enrollment-state.resolver';
import { EnrollmentStateService } from './enrollment-state.service';

describe('EnrollmentStateResolver', () => {
  let resolver: EnrollmentStateResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EnrollmentStateResolver, EnrollmentStateService],
    }).compile();

    resolver = module.get<EnrollmentStateResolver>(EnrollmentStateResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
