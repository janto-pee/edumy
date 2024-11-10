import { Test, TestingModule } from '@nestjs/testing';
import { EnrollmentReportService } from './enrollment-report.service';

describe('EnrollmentReportService', () => {
  let service: EnrollmentReportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EnrollmentReportService],
    }).compile();

    service = module.get<EnrollmentReportService>(EnrollmentReportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
