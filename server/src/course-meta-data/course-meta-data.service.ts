import { Injectable } from '@nestjs/common';
import { CreateCourseMetaDatumInput } from './dto/create-course-meta-datum.input';
import { UpdateCourseMetaDatumInput } from './dto/update-course-meta-datum.input';

@Injectable()
export class CourseMetaDataService {
  create(createCourseMetaDatumInput: CreateCourseMetaDatumInput) {
    return 'This action adds a new courseMetaDatum';
  }

  findAll() {
    return `This action returns all courseMetaData`;
  }

  findOne(id: number) {
    return `This action returns a #${id} courseMetaDatum`;
  }

  update(id: number, updateCourseMetaDatumInput: UpdateCourseMetaDatumInput) {
    return `This action updates a #${id} courseMetaDatum`;
  }

  remove(id: number) {
    return `This action removes a #${id} courseMetaDatum`;
  }
}
