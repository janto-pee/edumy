import { Injectable } from '@nestjs/common';
import { CreateAddressInput } from './dto/create-address.input';
import { UpdateAddressInput } from './dto/update-address.input';
import { InjectModel } from '@nestjs/mongoose';
import { Address } from './entities/address.entity';
import { Model } from 'mongoose';

@Injectable()
export class AddressService {
  constructor(
    @InjectModel(Address.name) private addressModel: Model<Address>,
  ) {}

  async create(createAddressDto: CreateAddressInput): Promise<Address> {
    const createdAddress = new this.addressModel(createAddressDto);
    return await createdAddress.save();
  }

  async findAll(): Promise<Address[]> {
    return await this.addressModel.find().exec();
  }

  async findOne(id: string) {
    return await this.addressModel.findById(id);
  }

  async findBy(search: any) {
    return await this.addressModel.findOne(search);
  }
  async update(id: string, updateAddressInput: UpdateAddressInput) {
    return await this.addressModel.findByIdAndUpdate(id, updateAddressInput, {
      new: true,
    });
  }

  async remove(id: string) {
    return await this.addressModel.findByIdAndDelete(id);
  }
}
