import { Module } from '@nestjs/common';
import { UserSkillsetReportService } from './user-skillset-report.service';
import { UserSkillsetReportResolver } from './user-skillset-report.resolver';
import {
  UserSkillsetReport,
  UserSkillsetReportSchema,
} from './entities/user-skillset-report.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserSkillsetReport.name, schema: UserSkillsetReportSchema },
    ]),
  ],
  providers: [UserSkillsetReportResolver, UserSkillsetReportService],
})
export class UserSkillsetReportModule {}
