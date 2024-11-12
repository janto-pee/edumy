import { Module } from '@nestjs/common';
import { EnrollmentReportService } from './enrollment-report.service';
import { EnrollmentReportResolver } from './enrollment-report.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import {
  EnrollmentReport,
  EnrollmentReportSchema,
} from './entities/enrollment-report.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EnrollmentReport.name, schema: EnrollmentReportSchema },
    ]),
  ],
  providers: [EnrollmentReportResolver, EnrollmentReportService],
})
export class EnrollmentReportModule {}
