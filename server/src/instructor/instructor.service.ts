import { Injectable } from '@nestjs/common';
import { CreateInstructorInput } from './dto/create-Instructor.input';
import { UpdateInstructorInput } from './dto/update-Instructor.input';
import { InjectModel } from '@nestjs/mongoose';
import { Instructor } from './entities/Instructor.entity';
import { Model } from 'mongoose';
import { Schema as MongooseSchema } from 'mongoose';

@Injectable()
export class InstructorService {
  constructor(
    @InjectModel(Instructor.name) private instructorModel: Model<Instructor>,
  ) {}

  async create(
    CreateInstructorInput: CreateInstructorInput,
  ): Promise<Instructor> {
    const createdInstructor = new this.instructorModel(CreateInstructorInput);
    return await createdInstructor.save();
  }

  async findAll(): Promise<Instructor[]> {
    return this.instructorModel.find().exec();
  }

  async findOne(id: MongooseSchema.Types.ObjectId) {
    return await this.instructorModel.findById(id);
  }

  async update(
    id: MongooseSchema.Types.ObjectId,
    updateInstructorInput: UpdateInstructorInput,
  ) {
    return await this.instructorModel.findByIdAndUpdate(
      id,
      updateInstructorInput,
    );
  }

  async remove(id: MongooseSchema.Types.ObjectId) {
    return await this.instructorModel.findByIdAndDelete(id);
  }
}
