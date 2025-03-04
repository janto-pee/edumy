import { Test, TestingModule } from '@nestjs/testing';
import { ContentitemService } from './contentitem.service';

describe('ContentitemService', () => {
  let service: ContentitemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContentitemService],
    }).compile();

    service = module.get<ContentitemService>(ContentitemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
