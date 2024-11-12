import { Injectable } from '@nestjs/common';
import { CreateItemRiskFlagInput } from './dto/create-item-risk-flag.input';
import { UpdateItemRiskFlagInput } from './dto/update-item-risk-flag.input';
import { InjectModel } from '@nestjs/mongoose';
import { ItemRiskFlag } from './entities/item-risk-flag.entity';
import { Model } from 'mongoose';
import { Schema as MongooseSchema } from 'mongoose';

@Injectable()
export class ItemRiskFlagService {
  constructor(
    @InjectModel(ItemRiskFlag.name)
    private itemRiskFlagModel: Model<ItemRiskFlag>,
  ) {}

  async create(
    CreateItemRiskFlagInput: CreateItemRiskFlagInput,
  ): Promise<ItemRiskFlag> {
    const createdItemRiskFlag = new this.itemRiskFlagModel(
      CreateItemRiskFlagInput,
    );
    return await createdItemRiskFlag.save();
  }

  async findAll(): Promise<ItemRiskFlag[]> {
    return this.itemRiskFlagModel.find().exec();
  }

  async findOne(id: MongooseSchema.Types.ObjectId) {
    return await this.itemRiskFlagModel.findById(id);
  }

  async update(
    id: MongooseSchema.Types.ObjectId,
    updateItemRiskFlagInput: UpdateItemRiskFlagInput,
  ) {
    return await this.itemRiskFlagModel.findByIdAndUpdate(
      id,
      updateItemRiskFlagInput,
    );
  }

  async remove(id: MongooseSchema.Types.ObjectId) {
    return await this.itemRiskFlagModel.findByIdAndDelete(id);
  }
}
