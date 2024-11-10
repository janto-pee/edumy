import { Test, TestingModule } from '@nestjs/testing';
import { CourseMaterialResolver } from './course-material.resolver';
import { CourseMaterialService } from './course-material.service';

describe('CourseMaterialResolver', () => {
  let resolver: CourseMaterialResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CourseMaterialResolver, CourseMaterialService],
    }).compile();

    resolver = module.get<CourseMaterialResolver>(CourseMaterialResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
