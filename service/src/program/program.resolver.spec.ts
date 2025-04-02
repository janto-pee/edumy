import { Test, TestingModule } from '@nestjs/testing';
import { ProgramResolver } from './program.resolver';
import { ProgramService } from './program.service';
import { getModelToken } from '@nestjs/mongoose';
import { Program } from './entities/program.entity';
import { Course } from 'src/course/entities/course.entity';

describe('ProgramResolver', () => {
  let resolver: ProgramResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          // Provider for the mongoose model
          provide: getModelToken(Program.name, Course.name),
          useValue: [Program, Course],
        },
        {
          // Provider for the mongoose model
          provide: getModelToken(Course.name),
          useValue: Course,
        },
        ProgramResolver,
        ProgramService,
      ],
    }).compile();

    resolver = module.get<ProgramResolver>(ProgramResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
