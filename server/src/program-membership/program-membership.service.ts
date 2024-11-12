import { Injectable } from '@nestjs/common';
import { CreateProgramMembershipInput } from './dto/create-program-membership.input';
import { UpdateProgramMembershipInput } from './dto/update-program-membership.input';
import { InjectModel } from '@nestjs/mongoose';
import { ProgramMembership } from './entities/program-membership.entity';
import { Model } from 'mongoose';
import { Schema as MongooseSchema } from 'mongoose';

@Injectable()
export class ProgramMembershipService {
  constructor(
    @InjectModel(ProgramMembership.name)
    private programMembershipModel: Model<ProgramMembership>,
  ) {}

  async create(
    CreateProgramMembershipInput: CreateProgramMembershipInput,
  ): Promise<ProgramMembership> {
    const createdProgramMembership = new this.programMembershipModel(
      CreateProgramMembershipInput,
    );
    return await createdProgramMembership.save();
  }

  async findAll(): Promise<ProgramMembership[]> {
    return this.programMembershipModel.find().exec();
  }

  async findOne(id: MongooseSchema.Types.ObjectId) {
    return await this.programMembershipModel.findById(id);
  }

  async update(
    id: MongooseSchema.Types.ObjectId,
    updateProgramMembershipInput: UpdateProgramMembershipInput,
  ) {
    return await this.programMembershipModel.findByIdAndUpdate(
      id,
      updateProgramMembershipInput,
    );
  }

  async remove(id: MongooseSchema.Types.ObjectId) {
    return await this.programMembershipModel.findByIdAndDelete(id);
  }
}
