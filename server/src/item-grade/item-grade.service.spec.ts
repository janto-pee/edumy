import { Test, TestingModule } from '@nestjs/testing';
import { ItemGradeService } from './item-grade.service';

describe('ItemGradeService', () => {
  let service: ItemGradeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ItemGradeService],
    }).compile();

    service = module.get<ItemGradeService>(ItemGradeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
