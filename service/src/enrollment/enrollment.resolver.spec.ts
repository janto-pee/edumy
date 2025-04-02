import { Test, TestingModule } from '@nestjs/testing';
import { EnrollmentResolver } from './enrollment.resolver';
import { EnrollmentService } from './enrollment.service';
import { getModelToken } from '@nestjs/mongoose';
import { Enrollment } from './entities/enrollment.entity';

describe('EnrollmentResolver', () => {
  let resolver: EnrollmentResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          // Provider for the mongoose model
          provide: getModelToken(Enrollment.name),
          useValue: Enrollment,
        },
        EnrollmentResolver,
        EnrollmentService,
      ],
    }).compile();

    resolver = module.get<EnrollmentResolver>(EnrollmentResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
