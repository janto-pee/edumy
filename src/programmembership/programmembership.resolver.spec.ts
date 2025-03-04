import { Test, TestingModule } from '@nestjs/testing';
import { ProgrammembershipResolver } from './programmembership.resolver';
import { ProgrammembershipService } from './programmembership.service';

describe('ProgrammembershipResolver', () => {
  let resolver: ProgrammembershipResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProgrammembershipResolver, ProgrammembershipService],
    }).compile();

    resolver = module.get<ProgrammembershipResolver>(ProgrammembershipResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
