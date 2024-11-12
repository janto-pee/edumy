import { Injectable } from '@nestjs/common';
import { CreateCourseInput } from './dto/create-course.input';
import { UpdateCourseInput } from './dto/update-course.input';
import { Course } from './entities/course.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';

@Injectable()
export class CourseService {
  constructor(@InjectModel(Course.name) private courseModel: Model<Course>) {}

  async create(CreateCourseInput: CreateCourseInput): Promise<Course> {
    const createdCourse = new this.courseModel(CreateCourseInput);
    return await createdCourse.save();
  }

  async findAll(): Promise<Course[]> {
    return await this.courseModel.find().exec();
  }

  async findOne(id: MongooseSchema.Types.ObjectId) {
    return await this.courseModel.findById(id);
  }

  async update(
    id: MongooseSchema.Types.ObjectId,
    updateCourseInput: UpdateCourseInput,
  ) {
    return await this.courseModel.findByIdAndUpdate(id, updateCourseInput);
  }

  async remove(id: MongooseSchema.Types.ObjectId) {
    return await this.courseModel.findByIdAndDelete(id);
  }
}
