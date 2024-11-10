import { Module } from '@nestjs/common';
import { CourseModuleService } from './course-module.service';
import { CourseModuleResolver } from './course-module.resolver';

@Module({
  providers: [CourseModuleResolver, CourseModuleService],
})
export class CourseModuleModule {}
