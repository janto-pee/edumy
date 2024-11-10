import { Injectable } from '@nestjs/common';
import { CreateProgramMembershipInput } from './dto/create-program-membership.input';
import { UpdateProgramMembershipInput } from './dto/update-program-membership.input';

@Injectable()
export class ProgramMembershipService {
  create(createProgramMembershipInput: CreateProgramMembershipInput) {
    return 'This action adds a new programMembership';
  }

  findAll() {
    return `This action returns all programMembership`;
  }

  findOne(id: number) {
    return `This action returns a #${id} programMembership`;
  }

  update(id: number, updateProgramMembershipInput: UpdateProgramMembershipInput) {
    return `This action updates a #${id} programMembership`;
  }

  remove(id: number) {
    return `This action removes a #${id} programMembership`;
  }
}
