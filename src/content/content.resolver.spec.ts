import { Test, TestingModule } from '@nestjs/testing';
import { ContentResolver } from './content.resolver';
import { ContentService } from './content.service';
import { Content } from './entities/content.entity';
import { getModelToken } from '@nestjs/mongoose';

describe('ContentResolver', () => {
  let resolver: ContentResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          // Provider for the mongoose model
          provide: getModelToken(Content.name),
          useValue: Content,
        },
        ContentResolver,
        ContentService,
      ],
    }).compile();

    resolver = module.get<ContentResolver>(ContentResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
