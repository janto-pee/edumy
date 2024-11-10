import { Test, TestingModule } from '@nestjs/testing';
import { CourseCurriculumService } from './course-curriculum.service';

describe('CourseCurriculumService', () => {
  let service: CourseCurriculumService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CourseCurriculumService],
    }).compile();

    service = module.get<CourseCurriculumService>(CourseCurriculumService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
