import { Test, TestingModule } from '@nestjs/testing';
import { AddressResolver } from './address.resolver';
import { AddressService } from './address.service';
import { Address } from './entities/address.entity';
import { getModelToken } from '@nestjs/mongoose';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

describe('AddressResolver', () => {
  let resolver: AddressResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getModelToken(Address.name),
          useValue: Address,
        },
        {
          provide: UserService,
          useValue: User,
        },
        User,
        UserService,
        AddressResolver,
        AddressService,
        Address,
      ],
    }).compile();

    resolver = module.get<AddressResolver>(AddressResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
