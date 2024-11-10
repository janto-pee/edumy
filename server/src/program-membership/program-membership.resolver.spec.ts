import { Test, TestingModule } from '@nestjs/testing';
import { ProgramMembershipResolver } from './program-membership.resolver';
import { ProgramMembershipService } from './program-membership.service';

describe('ProgramMembershipResolver', () => {
  let resolver: ProgramMembershipResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProgramMembershipResolver, ProgramMembershipService],
    }).compile();

    resolver = module.get<ProgramMembershipResolver>(ProgramMembershipResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
