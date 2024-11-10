import { Test, TestingModule } from '@nestjs/testing';
import { ItemGradeResolver } from './item-grade.resolver';
import { ItemGradeService } from './item-grade.service';

describe('ItemGradeResolver', () => {
  let resolver: ItemGradeResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ItemGradeResolver, ItemGradeService],
    }).compile();

    resolver = module.get<ItemGradeResolver>(ItemGradeResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
