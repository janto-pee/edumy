import { Injectable } from '@nestjs/common';
import { CreateCourseInput } from './dto/create-course.input';
import { UpdateCourseInput } from './dto/update-course.input';
import { Course } from './entities/course.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CourseService {
  constructor(@InjectModel(Course.name) private courseModel: Model<Course>) {}

  async create(createCourseDto: CreateCourseInput): Promise<Course> {
    const createdCourse = await this.courseModel.create(createCourseDto);
    return createdCourse;
  }

  async findAll(): Promise<Course[]> {
    return await this.courseModel.find().exec();
  }
  async filterBy(keyword: string): Promise<Course[]> {
    return await this.courseModel.find({ courseId: keyword }).exec();
  }

  async findOne(id: string) {
    return await this.courseModel.findById(id);
  }

  async findCourseByProgram(id: string) {
    return await this.courseModel.find({ program: id });
  }

  async update(id: string, updateCourseInput: UpdateCourseInput) {
    return await this.courseModel.findByIdAndUpdate(id, updateCourseInput, {
      new: true,
    });
  }

  async remove(id: string) {
    return await this.courseModel.findByIdAndDelete(id);
  }
}
