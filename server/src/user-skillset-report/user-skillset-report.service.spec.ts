import { Test, TestingModule } from '@nestjs/testing';
import { UserSkillsetReportService } from './user-skillset-report.service';

describe('UserSkillsetReportService', () => {
  let service: UserSkillsetReportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserSkillsetReportService],
    }).compile();

    service = module.get<UserSkillsetReportService>(UserSkillsetReportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
