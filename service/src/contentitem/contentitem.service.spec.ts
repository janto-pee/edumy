import { Test, TestingModule } from '@nestjs/testing';
import { ContentitemService } from './contentitem.service';
import { getModelToken } from '@nestjs/mongoose';
import { Contentitem } from './entities/contentitem.entity';

describe('ContentitemService', () => {
  let service: ContentitemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          // Provider for the mongoose model
          provide: getModelToken(Contentitem.name),
          useValue: Contentitem,
        },
        ContentitemService,
      ],
    }).compile();

    service = module.get<ContentitemService>(ContentitemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
