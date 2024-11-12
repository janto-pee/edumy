import { Injectable } from '@nestjs/common';
import { CreateSkillsetInput } from './dto/create-Skillset.input';
import { UpdateSkillsetInput } from './dto/update-Skillset.input';
import { InjectModel } from '@nestjs/mongoose';
import { Skillset } from './entities/Skillset.entity';
import { Model } from 'mongoose';
import { Schema as MongooseSchema } from 'mongoose';

@Injectable()
export class SkillsetService {
  constructor(
    @InjectModel(Skillset.name) private skillsetModel: Model<Skillset>,
  ) {}

  async create(CreateSkillsetInput: CreateSkillsetInput): Promise<Skillset> {
    const createdSkillset = new this.skillsetModel(CreateSkillsetInput);
    return await createdSkillset.save();
  }

  async findAll(): Promise<Skillset[]> {
    return this.skillsetModel.find().exec();
  }

  async findOne(id: MongooseSchema.Types.ObjectId) {
    return await this.skillsetModel.findById(id);
  }

  async update(
    id: MongooseSchema.Types.ObjectId,
    updateSkillsetInput: UpdateSkillsetInput,
  ) {
    return await this.skillsetModel.findByIdAndUpdate(id, updateSkillsetInput);
  }

  async remove(id: MongooseSchema.Types.ObjectId) {
    return await this.skillsetModel.findByIdAndDelete(id);
  }
}
