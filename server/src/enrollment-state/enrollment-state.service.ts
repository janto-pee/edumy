import { Injectable } from '@nestjs/common';
import { CreateEnrollmentStateInput } from './dto/create-enrollment-state.input';
import { UpdateEnrollmentStateInput } from './dto/update-enrollment-state.input';
import { InjectModel } from '@nestjs/mongoose';
import { EnrollmentState } from './entities/enrollment-state.entity';
import { Model } from 'mongoose';
import { Schema as MongooseSchema } from 'mongoose';

@Injectable()
export class EnrollmentStateService {
  constructor(
    @InjectModel(EnrollmentState.name)
    private enrollmentStateModel: Model<EnrollmentState>,
  ) {}

  async create(
    CreateEnrollmentStateInput: CreateEnrollmentStateInput,
  ): Promise<EnrollmentState> {
    const createdEnrollmentState = new this.enrollmentStateModel(
      CreateEnrollmentStateInput,
    );
    return await createdEnrollmentState.save();
  }

  async findAll(): Promise<EnrollmentState[]> {
    return this.enrollmentStateModel.find().exec();
  }

  async findOne(id: MongooseSchema.Types.ObjectId) {
    return await this.enrollmentStateModel.findById(id);
  }

  async update(
    id: MongooseSchema.Types.ObjectId,
    updateEnrollmentStateInput: UpdateEnrollmentStateInput,
  ) {
    return await this.enrollmentStateModel.findByIdAndUpdate(
      id,
      updateEnrollmentStateInput,
    );
  }

  async remove(id: MongooseSchema.Types.ObjectId) {
    return await this.enrollmentStateModel.findByIdAndDelete(id);
  }
}
