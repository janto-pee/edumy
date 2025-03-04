import { Test, TestingModule } from '@nestjs/testing';
import { CoursemetadataResolver } from './coursemetadata.resolver';
import { CoursemetadataService } from './coursemetadata.service';

describe('CoursemetadataResolver', () => {
  let resolver: CoursemetadataResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoursemetadataResolver, CoursemetadataService],
    }).compile();

    resolver = module.get<CoursemetadataResolver>(CoursemetadataResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
