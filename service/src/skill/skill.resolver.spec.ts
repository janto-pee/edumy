import { Test, TestingModule } from '@nestjs/testing';
import { SkillResolver } from './skill.resolver';
import { SkillService } from './skill.service';
import { getModelToken } from '@nestjs/mongoose';
import { Skill } from './entities/skill.entity';

describe('SkillResolver', () => {
  let resolver: SkillResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          // Provider for the mongoose model
          provide: getModelToken(Skill.name),
          useValue: Skill,
        },
        SkillResolver,
        SkillService,
      ],
    }).compile();

    resolver = module.get<SkillResolver>(SkillResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
