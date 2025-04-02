import { Test, TestingModule } from '@nestjs/testing';
import { CourseResolver } from './course.resolver';
import { CourseService } from './course.service';
import { getModelToken } from '@nestjs/mongoose';
import { Course } from './entities/course.entity';

describe('CourseResolver', () => {
  let resolver: CourseResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          // Provider for the mongoose model
          provide: getModelToken(Course.name),
          useValue: Course,
        },
        CourseResolver,
        CourseService,
      ],
    }).compile();

    resolver = module.get<CourseResolver>(CourseResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
