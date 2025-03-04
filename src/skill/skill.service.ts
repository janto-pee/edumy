import { Injectable } from '@nestjs/common';
import { CreateSkillInput } from './dto/create-skill.input';
import { UpdateSkillInput } from './dto/update-skill.input';
import { InjectModel } from '@nestjs/mongoose';
import { Skill } from './entities/skill.entity';
import { Model } from 'mongoose';

@Injectable()
export class SkillService {
  constructor(@InjectModel(Skill.name) private skillModel: Model<Skill>) {}

  async create(createSkillDto: CreateSkillInput): Promise<Skill> {
    const createdSkill = await this.skillModel.create(createSkillDto);
    return createdSkill;
  }

  async findAll(): Promise<Skill[]> {
    return this.skillModel.find().exec();
  }

  async findOne(id: string) {
    return await this.skillModel.findById(id);
  }

  async update(id: string, updateSkillInput: UpdateSkillInput) {
    return await this.skillModel.findByIdAndUpdate(id, updateSkillInput, {
      new: true,
    });
  }

  async remove(id: string) {
    return await this.skillModel.findByIdAndDelete(id);
  }
}
