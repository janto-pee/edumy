import { Test, TestingModule } from '@nestjs/testing';
import { ContentitemResolver } from './contentitem.resolver';
import { ContentitemService } from './contentitem.service';
import { getModelToken } from '@nestjs/mongoose';
import { Contentitem } from './entities/contentitem.entity';

describe('ContentitemResolver', () => {
  let resolver: ContentitemResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          // Provider for the mongoose model
          provide: getModelToken(Contentitem.name),
          useValue: Contentitem,
        },
        ContentitemResolver,
        ContentitemService,
      ],
    }).compile();

    resolver = module.get<ContentitemResolver>(ContentitemResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
