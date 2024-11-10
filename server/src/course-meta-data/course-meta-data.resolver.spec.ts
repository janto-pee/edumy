import { Test, TestingModule } from '@nestjs/testing';
import { CourseMetaDataResolver } from './course-meta-data.resolver';
import { CourseMetaDataService } from './course-meta-data.service';

describe('CourseMetaDataResolver', () => {
  let resolver: CourseMetaDataResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CourseMetaDataResolver, CourseMetaDataService],
    }).compile();

    resolver = module.get<CourseMetaDataResolver>(CourseMetaDataResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
