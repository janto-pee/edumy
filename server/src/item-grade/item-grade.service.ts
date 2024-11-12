import { Injectable } from '@nestjs/common';
import { CreateItemGradeInput } from './dto/create-item-grade.input';
import { UpdateItemGradeInput } from './dto/update-item-grade.input';
import { InjectModel } from '@nestjs/mongoose';
import { ItemGrade } from './entities/item-grade.entity';
import { Model } from 'mongoose';
import { Schema as MongooseSchema } from 'mongoose';

@Injectable()
export class ItemGradeService {
  constructor(
    @InjectModel(ItemGrade.name) private itemGradeModel: Model<ItemGrade>,
  ) {}

  async create(CreateItemGradeInput: CreateItemGradeInput): Promise<ItemGrade> {
    const createdItemGrade = new this.itemGradeModel(CreateItemGradeInput);
    return await createdItemGrade.save();
  }

  async findAll(): Promise<ItemGrade[]> {
    return this.itemGradeModel.find().exec();
  }

  async findOne(id: MongooseSchema.Types.ObjectId) {
    return await this.itemGradeModel.findById(id);
  }

  async update(
    id: MongooseSchema.Types.ObjectId,
    updateItemGradeInput: UpdateItemGradeInput,
  ) {
    return await this.itemGradeModel.findByIdAndUpdate(
      id,
      updateItemGradeInput,
    );
  }

  async remove(id: MongooseSchema.Types.ObjectId) {
    return await this.itemGradeModel.findByIdAndDelete(id);
  }
}
