import { Module } from '@nestjs/common';
import { EnrollmentReportService } from './enrollment-report.service';
import { EnrollmentReportResolver } from './enrollment-report.resolver';

@Module({
  providers: [EnrollmentReportResolver, EnrollmentReportService],
})
export class EnrollmentReportModule {}
