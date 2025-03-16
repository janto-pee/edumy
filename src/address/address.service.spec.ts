import { Test, TestingModule } from '@nestjs/testing';
import { AddressService } from './address.service';
import { Address } from './entities/address.entity';
import { getModelToken } from '@nestjs/mongoose';

describe('AddressService', () => {
  let service: AddressService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          // Provider for the mongoose model
          provide: getModelToken(Address.name),
          useValue: Address,
        },
        AddressService,
        Address,
      ],
    }).compile();

    service = module.get<AddressService>(AddressService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
