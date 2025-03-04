import { Test, TestingModule } from '@nestjs/testing';
import { ProgrammembershipService } from './programmembership.service';

describe('ProgrammembershipService', () => {
  let service: ProgrammembershipService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProgrammembershipService],
    }).compile();

    service = module.get<ProgrammembershipService>(ProgrammembershipService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
