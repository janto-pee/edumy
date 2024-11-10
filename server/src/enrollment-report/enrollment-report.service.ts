import { Injectable } from '@nestjs/common';
import { CreateEnrollmentReportInput } from './dto/create-enrollment-report.input';
import { UpdateEnrollmentReportInput } from './dto/update-enrollment-report.input';

@Injectable()
export class EnrollmentReportService {
  create(createEnrollmentReportInput: CreateEnrollmentReportInput) {
    return 'This action adds a new enrollmentReport';
  }

  findAll() {
    return `This action returns all enrollmentReport`;
  }

  findOne(id: number) {
    return `This action returns a #${id} enrollmentReport`;
  }

  update(id: number, updateEnrollmentReportInput: UpdateEnrollmentReportInput) {
    return `This action updates a #${id} enrollmentReport`;
  }

  remove(id: number) {
    return `This action removes a #${id} enrollmentReport`;
  }
}
