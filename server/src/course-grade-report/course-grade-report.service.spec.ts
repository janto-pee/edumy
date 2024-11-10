import { Test, TestingModule } from '@nestjs/testing';
import { CourseGradeReportService } from './course-grade-report.service';

describe('CourseGradeReportService', () => {
  let service: CourseGradeReportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CourseGradeReportService],
    }).compile();

    service = module.get<CourseGradeReportService>(CourseGradeReportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
