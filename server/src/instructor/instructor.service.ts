import { Injectable } from '@nestjs/common';
import { CreateInstructorInput } from './dto/create-instructor.input';
import { UpdateInstructorInput } from './dto/update-instructor.input';

@Injectable()
export class InstructorService {
  create(createInstructorInput: CreateInstructorInput) {
    return 'This action adds a new instructor';
  }

  findAll() {
    return `This action returns all instructor`;
  }

  findOne(id: number) {
    return `This action returns a #${id} instructor`;
  }

  update(id: number, updateInstructorInput: UpdateInstructorInput) {
    return `This action updates a #${id} instructor`;
  }

  remove(id: number) {
    return `This action removes a #${id} instructor`;
  }
}
