import { Test, TestingModule } from '@nestjs/testing';
import { CourseCurriculumResolver } from './course-curriculum.resolver';
import { CourseCurriculumService } from './course-curriculum.service';

describe('CourseCurriculumResolver', () => {
  let resolver: CourseCurriculumResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CourseCurriculumResolver, CourseCurriculumService],
    }).compile();

    resolver = module.get<CourseCurriculumResolver>(CourseCurriculumResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
