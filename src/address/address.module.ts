import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressResolver } from './address.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Address, AddressSchema } from './entities/address.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Address.name, schema: AddressSchema }]),
  ],
  providers: [AddressResolver, AddressService],
})
export class AddressModule {}
