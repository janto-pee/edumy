import { Injectable } from '@nestjs/common';
import { CreateCourseInput } from './dto/create-course.input';
import { UpdateCourseInput } from './dto/update-course.input';
import { Course } from './entities/course.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CourseService {
  constructor(@InjectModel(Course.name) private coourseModel: Model<Course>) {}

  async create(createCourseDto: CreateCourseInput): Promise<Course> {
    const createdCourse = await this.coourseModel.create(createCourseDto);
    return createdCourse;
  }

  async findAll(): Promise<Course[]> {
    return this.coourseModel.find().exec();
  }

  async findOne(id: string) {
    return await this.coourseModel.findById(id);
  }

  async update(id: string, updateCourseInput: UpdateCourseInput) {
    return await this.coourseModel.findByIdAndUpdate(id, updateCourseInput, {
      new: true,
    });
  }

  async remove(id: string) {
    return await this.coourseModel.findByIdAndDelete(id);
  }
}
