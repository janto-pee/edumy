import { Injectable } from '@nestjs/common';
import { CreateCourseMaterialInput } from './dto/create-course-material.input';
import { UpdateCourseMaterialInput } from './dto/update-course-material.input';

@Injectable()
export class CourseMaterialService {
  create(createCourseMaterialInput: CreateCourseMaterialInput) {
    return 'This action adds a new courseMaterial';
  }

  findAll() {
    return `This action returns all courseMaterial`;
  }

  findOne(id: number) {
    return `This action returns a #${id} courseMaterial`;
  }

  update(id: number, updateCourseMaterialInput: UpdateCourseMaterialInput) {
    return `This action updates a #${id} courseMaterial`;
  }

  remove(id: number) {
    return `This action removes a #${id} courseMaterial`;
  }
}
