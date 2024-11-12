import { Injectable } from '@nestjs/common';
import { CreateCourseMetaDatumInput } from './dto/create-course-meta-datum.input';
import { UpdateCourseMetaDatumInput } from './dto/update-course-meta-datum.input';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { CourseMetaDatum } from './entities/course-meta-datum.entity';

@Injectable()
export class CourseMetaDataService {
  constructor(
    @InjectModel(CourseMetaDatum.name)
    private courseMetaDatum: Model<CourseMetaDatum>,
  ) {}

  async create(
    CreateCourseMetaDatumInput: CreateCourseMetaDatumInput,
  ): Promise<CourseMetaDatum> {
    const createdUser = new this.courseMetaDatum(CreateCourseMetaDatumInput);
    return await createdUser.save();
  }

  async findAll(): Promise<CourseMetaDatum[]> {
    return this.courseMetaDatum.find().exec();
  }

  async findOne(id: MongooseSchema.Types.ObjectId) {
    return await this.courseMetaDatum.findById(id);
  }

  async update(
    id: MongooseSchema.Types.ObjectId,
    updateUserInput: UpdateCourseMetaDatumInput,
  ) {
    return await this.courseMetaDatum.findByIdAndUpdate(id, updateUserInput);
  }

  async remove(id: MongooseSchema.Types.ObjectId) {
    return await this.courseMetaDatum.findByIdAndDelete(id);
  }
}
