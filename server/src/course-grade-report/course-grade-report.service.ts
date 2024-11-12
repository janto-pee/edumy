import { Injectable } from '@nestjs/common';
import { CreateCourseGradeReportInput } from './dto/create-course-grade-report.input';
import { UpdateCourseGradeReportInput } from './dto/update-course-grade-report.input';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { CourseGradeReport } from './entities/course-grade-report.entity';

@Injectable()
export class CourseGradeReportService {
  constructor(
    @InjectModel(CourseGradeReport.name)
    private courseGradeReportModel: Model<CourseGradeReport>,
  ) {}

  async create(
    CreateCourseGradeReportInput: CreateCourseGradeReportInput,
  ): Promise<CourseGradeReport> {
    const createdCourseGradeReport = new this.courseGradeReportModel(
      CreateCourseGradeReportInput,
    );
    return await createdCourseGradeReport.save();
  }

  async findAll(): Promise<CourseGradeReport[]> {
    return this.courseGradeReportModel.find().exec();
  }

  async findOne(id: MongooseSchema.Types.ObjectId) {
    return await this.courseGradeReportModel.findById(id);
  }

  async update(
    id: MongooseSchema.Types.ObjectId,
    updateCourseGradeReportInput: UpdateCourseGradeReportInput,
  ) {
    return await this.courseGradeReportModel.findByIdAndUpdate(
      id,
      updateCourseGradeReportInput,
    );
  }

  async remove(id: MongooseSchema.Types.ObjectId) {
    return await this.courseGradeReportModel.findByIdAndDelete(id);
  }
}
