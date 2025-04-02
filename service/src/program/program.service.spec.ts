import { Test, TestingModule } from '@nestjs/testing';
import { ProgramService } from './program.service';
import { getModelToken } from '@nestjs/mongoose';
import { Program } from './entities/program.entity';
import { Course } from 'src/course/entities/course.entity';
import { CourseService } from 'src/course/course.service';

describe('ProgramService', () => {
  let service: ProgramService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          // Provider for the mongoose model
          provide: getModelToken(Program.name),
          useValue: Program,
        },
        {
          // Provider for the mongoose model
          provide: getModelToken(Course.name),
          useValue: Course,
        },
        ProgramService,
        CourseService,
      ],
    }).compile();

    service = module.get<ProgramService>(ProgramService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
