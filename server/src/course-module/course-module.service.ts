import { Injectable } from '@nestjs/common';
import { CreateCourseModuleInput } from './dto/create-course-module.input';
import { UpdateCourseModuleInput } from './dto/update-course-module.input';

@Injectable()
export class CourseModuleService {
  create(createCourseModuleInput: CreateCourseModuleInput) {
    return 'This action adds a new courseModule';
  }

  findAll() {
    return `This action returns all courseModule`;
  }

  findOne(id: number) {
    return `This action returns a #${id} courseModule`;
  }

  update(id: number, updateCourseModuleInput: UpdateCourseModuleInput) {
    return `This action updates a #${id} courseModule`;
  }

  remove(id: number) {
    return `This action removes a #${id} courseModule`;
  }
}
