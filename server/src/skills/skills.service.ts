import { Injectable } from '@nestjs/common';
import { CreateSkillInput } from './dto/create-skill.input';
import { UpdateSkillInput } from './dto/update-skill.input';
import { InjectModel } from '@nestjs/mongoose';
import { Skill } from './entities/Skill.entity';
import { Model } from 'mongoose';
import { Schema as MongooseSchema } from 'mongoose';

@Injectable()
export class SkillService {
  constructor(@InjectModel(Skill.name) private skillModel: Model<Skill>) {}

  async create(CreateSkillInput: CreateSkillInput): Promise<Skill> {
    const createdSkill = new this.skillModel(CreateSkillInput);
    return await createdSkill.save();
  }

  async findAll(): Promise<Skill[]> {
    return this.skillModel.find().exec();
  }

  async findOne(id: MongooseSchema.Types.ObjectId) {
    return await this.skillModel.findById(id);
  }

  async update(
    id: MongooseSchema.Types.ObjectId,
    updateSkillInput: UpdateSkillInput,
  ) {
    return await this.skillModel.findByIdAndUpdate(id, updateSkillInput);
  }

  async remove(id: MongooseSchema.Types.ObjectId) {
    return await this.skillModel.findByIdAndDelete(id);
  }
}
