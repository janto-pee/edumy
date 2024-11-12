import { Injectable } from '@nestjs/common';
import { CreateProgramInput } from './dto/create-Program.input';
import { UpdateProgramInput } from './dto/update-Program.input';
import { InjectModel } from '@nestjs/mongoose';
import { Program } from './entities/Program.entity';
import { Model } from 'mongoose';
import { Schema as MongooseSchema } from 'mongoose';

@Injectable()
export class ProgramService {
  constructor(
    @InjectModel(Program.name) private programModel: Model<Program>,
  ) {}

  async create(CreateProgramInput: CreateProgramInput): Promise<Program> {
    const createdProgram = new this.programModel(CreateProgramInput);
    return await createdProgram.save();
  }

  async findAll(): Promise<Program[]> {
    return this.programModel.find().exec();
  }

  async findOne(id: MongooseSchema.Types.ObjectId) {
    return await this.programModel.findById(id);
  }

  async update(
    id: MongooseSchema.Types.ObjectId,
    updateProgramInput: UpdateProgramInput,
  ) {
    return await this.programModel.findByIdAndUpdate(id, updateProgramInput);
  }

  async remove(id: MongooseSchema.Types.ObjectId) {
    return await this.programModel.findByIdAndDelete(id);
  }
}
