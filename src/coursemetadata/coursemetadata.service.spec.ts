import { Test, TestingModule } from '@nestjs/testing';
import { CoursemetadataService } from './coursemetadata.service';

describe('CoursemetadataService', () => {
  let service: CoursemetadataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoursemetadataService],
    }).compile();

    service = module.get<CoursemetadataService>(CoursemetadataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
