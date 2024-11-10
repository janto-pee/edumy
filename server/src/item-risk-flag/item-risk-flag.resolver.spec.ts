import { Test, TestingModule } from '@nestjs/testing';
import { ItemRiskFlagResolver } from './item-risk-flag.resolver';
import { ItemRiskFlagService } from './item-risk-flag.service';

describe('ItemRiskFlagResolver', () => {
  let resolver: ItemRiskFlagResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ItemRiskFlagResolver, ItemRiskFlagService],
    }).compile();

    resolver = module.get<ItemRiskFlagResolver>(ItemRiskFlagResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
