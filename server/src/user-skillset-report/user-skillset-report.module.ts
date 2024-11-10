import { Module } from '@nestjs/common';
import { UserSkillsetReportService } from './user-skillset-report.service';
import { UserSkillsetReportResolver } from './user-skillset-report.resolver';

@Module({
  providers: [UserSkillsetReportResolver, UserSkillsetReportService],
})
export class UserSkillsetReportModule {}
