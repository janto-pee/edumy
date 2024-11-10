import { Module } from '@nestjs/common';
import { CourseGradeReportService } from './course-grade-report.service';
import { CourseGradeReportResolver } from './course-grade-report.resolver';

@Module({
  providers: [CourseGradeReportResolver, CourseGradeReportService],
})
export class CourseGradeReportModule {}
