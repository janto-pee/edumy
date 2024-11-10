import { Injectable } from '@nestjs/common';
import { CreateEnrollmentStateInput } from './dto/create-enrollment-state.input';
import { UpdateEnrollmentStateInput } from './dto/update-enrollment-state.input';

@Injectable()
export class EnrollmentStateService {
  create(createEnrollmentStateInput: CreateEnrollmentStateInput) {
    return 'This action adds a new enrollmentState';
  }

  findAll() {
    return `This action returns all enrollmentState`;
  }

  findOne(id: number) {
    return `This action returns a #${id} enrollmentState`;
  }

  update(id: number, updateEnrollmentStateInput: UpdateEnrollmentStateInput) {
    return `This action updates a #${id} enrollmentState`;
  }

  remove(id: number) {
    return `This action removes a #${id} enrollmentState`;
  }
}
