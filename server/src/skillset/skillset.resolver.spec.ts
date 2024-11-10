import { Test, TestingModule } from '@nestjs/testing';
import { SkillsetResolver } from './skillset.resolver';
import { SkillsetService } from './skillset.service';

describe('SkillsetResolver', () => {
  let resolver: SkillsetResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SkillsetResolver, SkillsetService],
    }).compile();

    resolver = module.get<SkillsetResolver>(SkillsetResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
