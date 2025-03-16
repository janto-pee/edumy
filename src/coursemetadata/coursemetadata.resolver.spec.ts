import { Test, TestingModule } from '@nestjs/testing';
import { CoursemetadataResolver } from './coursemetadata.resolver';
import { CoursemetadataService } from './coursemetadata.service';
import { getModelToken } from '@nestjs/mongoose';
import { Coursemetada } from './entities/coursemetadatum.entity';

describe('CoursemetadataResolver', () => {
  let resolver: CoursemetadataResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          // Provider for the mongoose model
          provide: getModelToken(Coursemetada.name),
          useValue: Coursemetada,
        },
        CoursemetadataResolver,
        CoursemetadataService,
      ],
    }).compile();

    resolver = module.get<CoursemetadataResolver>(CoursemetadataResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
