import { Test, TestingModule } from '@nestjs/testing';
import { ProgramService } from './program.service';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Program, ProgramSchema } from './entities/program.entity';
import { Course, CourseSchema } from 'src/course/entities/course.entity';

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
        ProgramService,
      ],
    }).compile();

    service = module.get<ProgramService>(ProgramService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
