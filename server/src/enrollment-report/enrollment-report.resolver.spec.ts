import { Test, TestingModule } from '@nestjs/testing';
import { EnrollmentReportResolver } from './enrollment-report.resolver';
import { EnrollmentReportService } from './enrollment-report.service';

describe('EnrollmentReportResolver', () => {
  let resolver: EnrollmentReportResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EnrollmentReportResolver, EnrollmentReportService],
    }).compile();

    resolver = module.get<EnrollmentReportResolver>(EnrollmentReportResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
