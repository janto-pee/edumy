import { Module } from '@nestjs/common';
import { CourseCurriculumService } from './course-curriculum.service';
import { CourseCurriculumResolver } from './course-curriculum.resolver';
import {
  CourseCurriculum,
  CourseCurriculumSchema,
} from './entities/course-curriculum.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CourseCurriculum.name, schema: CourseCurriculumSchema },
    ]),
  ],
  providers: [CourseCurriculumResolver, CourseCurriculumService],
})
export class CourseCurriculumModule {}
