import { Injectable } from '@nestjs/common';
import { CreateAddressInput } from './dto/create-address.input';
import { UpdateAddressInput } from './dto/update-address.input';
import { InjectModel } from '@nestjs/mongoose';
import { Address } from './entities/address.entity';
import { Model } from 'mongoose';
import { Schema as MongooseSchema } from 'mongoose';

@Injectable()
export class AddressService {
  constructor(
    @InjectModel(Address.name) private addressModel: Model<Address>,
  ) {}

  async create(createAddressDto: CreateAddressInput): Promise<Address> {
    const createdAddress = new this.addressModel(createAddressDto);
    return createdAddress.save();
  }

  async findAll(): Promise<Address[]> {
    return this.addressModel.find().exec();
  }

  async findOne(id: MongooseSchema.Types.ObjectId) {
    return await this.addressModel.findById(id);
  }

  async update(
    id: MongooseSchema.Types.ObjectId,
    updateAddressInput: UpdateAddressInput,
  ) {
    return await this.addressModel.findByIdAndUpdate(id, updateAddressInput);
  }

  async remove(id: MongooseSchema.Types.ObjectId) {
    return await this.addressModel.findByIdAndDelete(id);
  }
}
