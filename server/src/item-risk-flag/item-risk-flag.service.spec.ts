import { Test, TestingModule } from '@nestjs/testing';
import { ItemRiskFlagService } from './item-risk-flag.service';

describe('ItemRiskFlagService', () => {
  let service: ItemRiskFlagService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ItemRiskFlagService],
    }).compile();

    service = module.get<ItemRiskFlagService>(ItemRiskFlagService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
