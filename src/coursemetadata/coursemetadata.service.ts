import { Injectable } from '@nestjs/common';
import { CreateCoursemetadatumInput } from './dto/create-coursemetadatum.input';
import { UpdateCoursemetadatumInput } from './dto/update-coursemetadatum.input';
import { Model } from 'mongoose';
import { Coursemetada } from './entities/coursemetadatum.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CoursemetadataService {
  constructor(
    @InjectModel(Coursemetada.name)
    private courseMetadataModel: Model<Coursemetada>,
  ) {}

  async create(
    createCoursemetadaDto: CreateCoursemetadatumInput,
  ): Promise<Coursemetada> {
    const createdCoursemetada = await this.courseMetadataModel.create(
      createCoursemetadaDto,
    );
    return createdCoursemetada;
  }

  async findAll(): Promise<Coursemetada[]> {
    return this.courseMetadataModel.find().exec();
  }

  async findOne(id: string) {
    return await this.courseMetadataModel.findById(id);
  }

  async update(
    id: string,
    updateCoursemetadaInput: UpdateCoursemetadatumInput,
  ) {
    return await this.courseMetadataModel.findByIdAndUpdate(
      id,
      updateCoursemetadaInput,
      { new: true },
    );
  }

  async remove(id: string) {
    return await this.courseMetadataModel.findByIdAndDelete(id);
  }
}
