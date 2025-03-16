import { Test, TestingModule } from '@nestjs/testing';
import { ProgramMembershipResolver } from './programmembership.resolver';
import { ProgrammembershipService } from './programmembership.service';
import { getModelToken } from '@nestjs/mongoose';
import { ProgramMembership } from './entities/programmembership.entity';
import { Program } from 'src/program/entities/program.entity';

describe('ProgramMembershipResolver', () => {
  let resolver: ProgramMembershipResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          // Provider for the mongoose model
          provide: getModelToken(ProgramMembership.name),
          useValue: ProgramMembership,
        },
        {
          // Provider for the mongoose model
          provide: getModelToken(Program.name),
          useValue: Program,
        },
        ProgramMembershipResolver,
        ProgrammembershipService,
      ],
    }).compile();

    resolver = module.get<ProgramMembershipResolver>(ProgramMembershipResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
