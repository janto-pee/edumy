import { Test, TestingModule } from '@nestjs/testing';
import { ProgramMembershipService } from './program-membership.service';

describe('ProgramMembershipService', () => {
  let service: ProgramMembershipService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProgramMembershipService],
    }).compile();

    service = module.get<ProgramMembershipService>(ProgramMembershipService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
