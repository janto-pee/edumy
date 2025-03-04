import { Test, TestingModule } from '@nestjs/testing';
import { ContentitemResolver } from './contentitem.resolver';
import { ContentitemService } from './contentitem.service';

describe('ContentitemResolver', () => {
  let resolver: ContentitemResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContentitemResolver, ContentitemService],
    }).compile();

    resolver = module.get<ContentitemResolver>(ContentitemResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
