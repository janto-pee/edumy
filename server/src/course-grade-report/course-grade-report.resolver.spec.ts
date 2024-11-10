import { Test, TestingModule } from '@nestjs/testing';
import { CourseGradeReportResolver } from './course-grade-report.resolver';
import { CourseGradeReportService } from './course-grade-report.service';

describe('CourseGradeReportResolver', () => {
  let resolver: CourseGradeReportResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CourseGradeReportResolver, CourseGradeReportService],
    }).compile();

    resolver = module.get<CourseGradeReportResolver>(CourseGradeReportResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
