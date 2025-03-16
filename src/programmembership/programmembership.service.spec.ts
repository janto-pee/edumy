import { Test, TestingModule } from '@nestjs/testing';
import { ProgrammembershipService } from './programmembership.service';
import { getModelToken } from '@nestjs/mongoose';
import { ProgramMembership } from './entities/programmembership.entity';
import { Program } from 'src/program/entities/program.entity';

describe('ProgrammembershipService', () => {
  let service: ProgrammembershipService;

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
        ProgrammembershipService,
      ],
    }).compile();

    service = module.get<ProgrammembershipService>(ProgrammembershipService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
