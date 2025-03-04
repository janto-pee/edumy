import { Injectable } from '@nestjs/common';
import { CreateProgrammembershipInput } from './dto/create-programmembership.input';
import { UpdateProgrammembershipInput } from './dto/update-programmembership.input';

@Injectable()
export class ProgrammembershipService {
  create(createProgrammembershipInput: CreateProgrammembershipInput) {
    return 'This action adds a new programmembership';
  }

  findAll() {
    return `This action returns all programmembership`;
  }

  findOne(id: number) {
    return `This action returns a #${id} programmembership`;
  }

  update(id: number, updateProgrammembershipInput: UpdateProgrammembershipInput) {
    return `This action updates a #${id} programmembership`;
  }

  remove(id: number) {
    return `This action removes a #${id} programmembership`;
  }
}
