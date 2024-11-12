import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserSkillsetReport } from './entities/user-skillset-report.entity';
import { Model } from 'mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { CreateUserSkillsetReportInput } from './dto/create-user-skillset-report.input';
import { UpdateUserSkillsetReportInput } from './dto/update-user-skillset-report.input';

@Injectable()
export class UserSkillsetReportService {
  constructor(
    @InjectModel(UserSkillsetReport.name)
    private UserSkillsetReportModel: Model<UserSkillsetReport>,
  ) {}

  async create(
    CreateUserSkillsetReportInput: CreateUserSkillsetReportInput,
  ): Promise<UserSkillsetReport> {
    const createdUserSkillsetReport = new this.UserSkillsetReportModel(
      CreateUserSkillsetReportInput,
    );
    return await createdUserSkillsetReport.save();
  }

  async findAll(): Promise<UserSkillsetReport[]> {
    return this.UserSkillsetReportModel.find().exec();
  }

  async findOne(id: MongooseSchema.Types.ObjectId) {
    return await this.UserSkillsetReportModel.findById(id);
  }

  async update(
    id: MongooseSchema.Types.ObjectId,
    updateUserSkillsetReportInput: UpdateUserSkillsetReportInput,
  ) {
    return await this.UserSkillsetReportModel.findByIdAndUpdate(
      id,
      updateUserSkillsetReportInput,
    );
  }

  async remove(id: MongooseSchema.Types.ObjectId) {
    return await this.UserSkillsetReportModel.findByIdAndDelete(id);
  }
}
