import { Injectable } from '@nestjs/common';
import { CreateCourseCurriculumInput } from './dto/create-course-curriculum.input';
import { UpdateCourseCurriculumInput } from './dto/update-course-curriculum.input';

@Injectable()
export class CourseCurriculumService {
  create(createCourseCurriculumInput: CreateCourseCurriculumInput) {
    return 'This action adds a new courseCurriculum';
  }

  findAll() {
    return `This action returns all courseCurriculum`;
  }

  findOne(id: number) {
    return `This action returns a #${id} courseCurriculum`;
  }

  update(id: number, updateCourseCurriculumInput: UpdateCourseCurriculumInput) {
    return `This action updates a #${id} courseCurriculum`;
  }

  remove(id: number) {
    return `This action removes a #${id} courseCurriculum`;
  }
}
