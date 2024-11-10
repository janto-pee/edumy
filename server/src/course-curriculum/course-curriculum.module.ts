import { Module } from '@nestjs/common';
import { CourseCurriculumService } from './course-curriculum.service';
import { CourseCurriculumResolver } from './course-curriculum.resolver';

@Module({
  providers: [CourseCurriculumResolver, CourseCurriculumService],
})
export class CourseCurriculumModule {}
