import { Test, TestingModule } from '@nestjs/testing';
import { ProgramMembershipResolver } from './programmembership.resolver';
import { ProgrammembershipService } from './programmembership.service';

describe('ProgramMembershipResolver', () => {
  let resolver: ProgramMembershipResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProgramMembershipResolver, ProgrammembershipService],
    }).compile();

    resolver = module.get<ProgramMembershipResolver>(ProgramMembershipResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
