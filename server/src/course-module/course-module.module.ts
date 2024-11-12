import { Module } from '@nestjs/common';
import { CourseModuleService } from './course-module.service';
import { CourseModuleResolver } from './course-module.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { CourseModuleSchema } from './entities/course-module.entity';
import { CourseModule } from 'src/course/course.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CourseModule.name, schema: CourseModuleSchema },
    ]),
  ],
  providers: [CourseModuleResolver, CourseModuleService],
})
export class CourseModuleModule {}
