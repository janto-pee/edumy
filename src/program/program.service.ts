import { Injectable } from '@nestjs/common';
import { CreateProgramInput } from './dto/create-program.input';
import { UpdateProgramInput } from './dto/update-program.input';
import { InjectModel } from '@nestjs/mongoose';
import { Program } from './entities/program.entity';
import { Model } from 'mongoose';

@Injectable()
export class ProgramService {
  constructor(
    @InjectModel(Program.name) private programModel: Model<Program>,
  ) {}

  async create(createProgramDto: CreateProgramInput): Promise<Program> {
    const createdProgram = await this.programModel.create(createProgramDto);
    return createdProgram;
  }

  async findAll(): Promise<Program[]> {
    return await this.programModel.find().exec();
  }

  async findOne(id: string) {
    return await this.programModel.findById(id);
  }

  async update(id: string, updateProgramInput: UpdateProgramInput) {
    return await this.programModel.findByIdAndUpdate(id, updateProgramInput, {
      new: true,
    });
  }

  async remove(id: string) {
    return await this.programModel.findByIdAndDelete(id);
  }
}
