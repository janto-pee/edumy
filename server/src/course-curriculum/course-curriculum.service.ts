import { Injectable } from '@nestjs/common';
import { CreateCourseCurriculumInput } from './dto/create-course-curriculum.input';
import { UpdateCourseCurriculumInput } from './dto/update-course-curriculum.input';
import { InjectModel } from '@nestjs/mongoose';
import { CourseCurriculum } from './entities/course-curriculum.entity';
import { Model } from 'mongoose';
import { Schema as MongooseSchema } from 'mongoose';

@Injectable()
export class CourseCurriculumService {
  constructor(
    @InjectModel(CourseCurriculum.name)
    private courseCurriculumModel: Model<CourseCurriculum>,
  ) {}

  async create(
    CreateCourseCurriculumInput: CreateCourseCurriculumInput,
  ): Promise<CourseCurriculum> {
    const createdCourseCurriculum = new this.courseCurriculumModel(
      CreateCourseCurriculumInput,
    );
    return await createdCourseCurriculum.save();
  }

  async findAll(): Promise<CourseCurriculum[]> {
    return this.courseCurriculumModel.find().exec();
  }

  async findOne(id: MongooseSchema.Types.ObjectId) {
    return await this.courseCurriculumModel.findById(id);
  }

  async update(
    id: MongooseSchema.Types.ObjectId,
    updateCourseCurriculumInput: UpdateCourseCurriculumInput,
  ) {
    return await this.courseCurriculumModel.findByIdAndUpdate(
      id,
      updateCourseCurriculumInput,
    );
  }

  async remove(id: MongooseSchema.Types.ObjectId) {
    return await this.courseCurriculumModel.findByIdAndDelete(id);
  }
}
