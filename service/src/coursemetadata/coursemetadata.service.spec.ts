import { Test, TestingModule } from '@nestjs/testing';
import { CoursemetadataService } from './coursemetadata.service';
import { getModelToken } from '@nestjs/mongoose';
import { Coursemetada } from './entities/coursemetadatum.entity';

describe('CoursemetadataService', () => {
  let service: CoursemetadataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getModelToken(Coursemetada.name),
          useValue: Coursemetada,
        },
        CoursemetadataService,
      ],
    }).compile();

    service = module.get<CoursemetadataService>(CoursemetadataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
