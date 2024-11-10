import { Test, TestingModule } from '@nestjs/testing';
import { UserSkillsetReportResolver } from './user-skillset-report.resolver';
import { UserSkillsetReportService } from './user-skillset-report.service';

describe('UserSkillsetReportResolver', () => {
  let resolver: UserSkillsetReportResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserSkillsetReportResolver, UserSkillsetReportService],
    }).compile();

    resolver = module.get<UserSkillsetReportResolver>(UserSkillsetReportResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
