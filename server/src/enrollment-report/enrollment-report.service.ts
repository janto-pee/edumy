import { Injectable } from '@nestjs/common';
import { CreateEnrollmentReportInput } from './dto/create-enrollment-report.input';
import { UpdateEnrollmentReportInput } from './dto/update-enrollment-report.input';
import { InjectModel } from '@nestjs/mongoose';
import { EnrollmentReport } from './entities/enrollment-report.entity';
import { Model } from 'mongoose';
import { Schema as MongooseSchema } from 'mongoose';

@Injectable()
export class EnrollmentReportService {
  constructor(
    @InjectModel(EnrollmentReport.name)
    private nrollmentReportModel: Model<EnrollmentReport>,
  ) {}

  async create(
    CreateEnrollmentReportInput: CreateEnrollmentReportInput,
  ): Promise<EnrollmentReport> {
    const createdEnrollmentReport = new this.nrollmentReportModel(
      CreateEnrollmentReportInput,
    );
    return await createdEnrollmentReport.save();
  }

  async findAll(): Promise<EnrollmentReport[]> {
    return this.nrollmentReportModel.find().exec();
  }

  async findOne(id: MongooseSchema.Types.ObjectId) {
    return await this.nrollmentReportModel.findById(id);
  }

  async update(
    id: MongooseSchema.Types.ObjectId,
    updateEnrollmentReportInput: UpdateEnrollmentReportInput,
  ) {
    return await this.nrollmentReportModel.findByIdAndUpdate(
      id,
      updateEnrollmentReportInput,
    );
  }

  async remove(id: MongooseSchema.Types.ObjectId) {
    return await this.nrollmentReportModel.findByIdAndDelete(id);
  }
}
