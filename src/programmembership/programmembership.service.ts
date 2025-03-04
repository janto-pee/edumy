import { Injectable } from '@nestjs/common';
import { CreateProgrammembershipInput } from './dto/create-programmembership.input';
import { UpdateProgrammembershipInput } from './dto/update-programmembership.input';
import { InjectModel } from '@nestjs/mongoose';
import { ProgramMembership } from './entities/programmembership.entity';
import { Model } from 'mongoose';

@Injectable()
export class ProgrammembershipService {
  constructor(
    @InjectModel(ProgramMembership.name)
    private programmembershipModel: Model<ProgramMembership>,
  ) {}

  async create(
    createProgramMembershipDto: CreateProgrammembershipInput,
  ): Promise<ProgramMembership> {
    const createdProgramMembership = await this.programmembershipModel.create(
      createProgramMembershipDto,
    );
    return createdProgramMembership;
  }

  async findAll(): Promise<ProgramMembership[]> {
    return this.programmembershipModel.find().exec();
  }

  async findOne(id: string) {
    return await this.programmembershipModel.findById(id);
  }

  async update(
    id: string,
    updateProgramMembershipInput: UpdateProgrammembershipInput,
  ) {
    return await this.programmembershipModel.findByIdAndUpdate(
      id,
      updateProgramMembershipInput,
      { new: true },
    );
  }

  async remove(id: string) {
    return await this.programmembershipModel.findByIdAndDelete(id);
  }
}
