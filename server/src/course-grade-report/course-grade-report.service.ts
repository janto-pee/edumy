import { Injectable } from '@nestjs/common';
import { CreateCourseGradeReportInput } from './dto/create-course-grade-report.input';
import { UpdateCourseGradeReportInput } from './dto/update-course-grade-report.input';

@Injectable()
export class CourseGradeReportService {
  create(createCourseGradeReportInput: CreateCourseGradeReportInput) {
    return 'This action adds a new courseGradeReport';
  }

  findAll() {
    return `This action returns all courseGradeReport`;
  }

  findOne(id: number) {
    return `This action returns a #${id} courseGradeReport`;
  }

  update(id: number, updateCourseGradeReportInput: UpdateCourseGradeReportInput) {
    return `This action updates a #${id} courseGradeReport`;
  }

  remove(id: number) {
    return `This action removes a #${id} courseGradeReport`;
  }
}
