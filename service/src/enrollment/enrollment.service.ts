import { Injectable } from '@nestjs/common';
import { CreateEnrollmentInput } from './dto/create-enrollment.input';
import { UpdateEnrollmentInput } from './dto/update-enrollment.input';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Enrollment } from './entities/enrollment.entity';

@Injectable()
export class EnrollmentService {
  constructor(
    @InjectModel(Enrollment.name) private enrollmentModel: Model<Enrollment>,
  ) {}

  async create(
    createEnrollmentDto: CreateEnrollmentInput,
  ): Promise<Enrollment> {
    const createdEnrollment =
      await this.enrollmentModel.create(createEnrollmentDto);
    return createdEnrollment;
  }

  async findAll(): Promise<Enrollment[]> {
    return await this.enrollmentModel.find().exec();
  }

  async findOne(id: string) {
    return await this.enrollmentModel.findById(id);
  }

  async update(id: string, updateEnrollmentInput: UpdateEnrollmentInput) {
    return await this.enrollmentModel.findByIdAndUpdate(
      id,
      updateEnrollmentInput,
      { new: true },
    );
  }

  async remove(id: string) {
    return await this.enrollmentModel.findByIdAndDelete(id);
  }
}
