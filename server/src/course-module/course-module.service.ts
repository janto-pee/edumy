import { Injectable } from '@nestjs/common';
import { CreateCourseModuleInput } from './dto/create-course-module.input';
import { UpdateCourseModuleInput } from './dto/update-course-module.input';
import { InjectModel } from '@nestjs/mongoose';
import { CourseModule } from './entities/course-module.entity';
import { Model } from 'mongoose';
import { Schema as MongooseSchema } from 'mongoose';

@Injectable()
export class CourseModuleService {
  constructor(
    @InjectModel(CourseModule.name)
    private courseModuleModel: Model<CourseModule>,
  ) {}

  async create(
    CreateCourseModuleInput: CreateCourseModuleInput,
  ): Promise<CourseModule> {
    const createdCourseModule = new this.courseModuleModel(
      CreateCourseModuleInput,
    );
    return await createdCourseModule.save();
  }

  async findAll(): Promise<CourseModule[]> {
    return this.courseModuleModel.find().exec();
  }

  async findOne(id: MongooseSchema.Types.ObjectId) {
    return await this.courseModuleModel.findById(id);
  }

  async update(
    id: MongooseSchema.Types.ObjectId,
    updateCourseModuleInput: UpdateCourseModuleInput,
  ) {
    return await this.courseModuleModel.findByIdAndUpdate(
      id,
      updateCourseModuleInput,
    );
  }

  async remove(id: MongooseSchema.Types.ObjectId) {
    return await this.courseModuleModel.findByIdAndDelete(id);
  }
}
