import { Test, TestingModule } from '@nestjs/testing';
import { SkillService } from './skill.service';
import { getModelToken } from '@nestjs/mongoose';
import { Skill } from './entities/skill.entity';

describe('SkillService', () => {
  let service: SkillService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          // Provider for the mongoose model
          provide: getModelToken(Skill.name),
          useValue: Skill,
        },
        SkillService,
      ],
    }).compile();

    service = module.get<SkillService>(SkillService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
