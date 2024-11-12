import { Module } from '@nestjs/common';
import { CourseGradeReportService } from './course-grade-report.service';
import { CourseGradeReportResolver } from './course-grade-report.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { CourseGradeReport } from './entities/course-grade-report.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CourseGradeReport.name, schema: CourseGradeReport },
    ]),
  ],
  providers: [CourseGradeReportResolver, CourseGradeReportService],
})
export class CourseGradeReportModule {}
