import { Injectable } from '@nestjs/common';
import { CreateCourseMaterialInput } from './dto/create-course-material.input';
import { UpdateCourseMaterialInput } from './dto/update-course-material.input';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { CourseMaterial } from './entities/course-material.entity';

@Injectable()
export class CourseMaterialService {
  constructor(
    @InjectModel(CourseMaterial.name)
    private courseMaterialModel: Model<CourseMaterial>,
  ) {}

  async create(
    CreateCourseMaterialInput: CreateCourseMaterialInput,
  ): Promise<CourseMaterial> {
    const createdCourseMaterial = new this.courseMaterialModel(
      CreateCourseMaterialInput,
    );
    return await createdCourseMaterial.save();
  }

  async findAll(): Promise<CourseMaterial[]> {
    return this.courseMaterialModel.find().exec();
  }

  async findOne(id: MongooseSchema.Types.ObjectId) {
    return await this.courseMaterialModel.findById(id);
  }

  async update(
    id: MongooseSchema.Types.ObjectId,
    updateCourseMaterialInput: UpdateCourseMaterialInput,
  ) {
    return await this.courseMaterialModel.findByIdAndUpdate(
      id,
      updateCourseMaterialInput,
    );
  }

  async remove(id: MongooseSchema.Types.ObjectId) {
    return await this.courseMaterialModel.findByIdAndDelete(id);
  }
}
