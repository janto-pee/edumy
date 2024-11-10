import { Test, TestingModule } from '@nestjs/testing';
import { CourseMaterialService } from './course-material.service';

describe('CourseMaterialService', () => {
  let service: CourseMaterialService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CourseMaterialService],
    }).compile();

    service = module.get<CourseMaterialService>(CourseMaterialService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
