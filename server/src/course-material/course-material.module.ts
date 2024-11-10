import { Module } from '@nestjs/common';
import { CourseMaterialService } from './course-material.service';
import { CourseMaterialResolver } from './course-material.resolver';

@Module({
  providers: [CourseMaterialResolver, CourseMaterialService],
})
export class CourseMaterialModule {}
