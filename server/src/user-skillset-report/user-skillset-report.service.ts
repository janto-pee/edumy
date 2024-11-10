import { Injectable } from '@nestjs/common';
import { CreateUserSkillsetReportInput } from './dto/create-user-skillset-report.input';
import { UpdateUserSkillsetReportInput } from './dto/update-user-skillset-report.input';

@Injectable()
export class UserSkillsetReportService {
  create(createUserSkillsetReportInput: CreateUserSkillsetReportInput) {
    return 'This action adds a new userSkillsetReport';
  }

  findAll() {
    return `This action returns all userSkillsetReport`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userSkillsetReport`;
  }

  update(id: number, updateUserSkillsetReportInput: UpdateUserSkillsetReportInput) {
    return `This action updates a #${id} userSkillsetReport`;
  }

  remove(id: number) {
    return `This action removes a #${id} userSkillsetReport`;
  }
}
