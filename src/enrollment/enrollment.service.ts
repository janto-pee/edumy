import { Injectable } from '@nestjs/common';
import { CreateEnrollmentInput } from './dto/create-enrollment.input';
import { UpdateEnrollmentInput } from './dto/update-enrollment.input';

@Injectable()
export class EnrollmentService {
  create(createEnrollmentInput: CreateEnrollmentInput) {
    return 'This action adds a new enrollment';
  }

  findAll() {
    return `This action returns all enrollment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} enrollment`;
  }

  update(id: number, updateEnrollmentInput: UpdateEnrollmentInput) {
    return `This action updates a #${id} enrollment`;
  }

  remove(id: number) {
    return `This action removes a #${id} enrollment`;
  }
}
