import { Test, TestingModule } from '@nestjs/testing';
import { CourseMetaDataService } from './course-meta-data.service';

describe('CourseMetaDataService', () => {
  let service: CourseMetaDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CourseMetaDataService],
    }).compile();

    service = module.get<CourseMetaDataService>(CourseMetaDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
