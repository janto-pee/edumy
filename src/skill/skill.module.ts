import { Module } from '@nestjs/common';
import { SkillService } from './skill.service';
import { SkillResolver } from './skill.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Skill, SkillSchema } from './entities/skill.entity';
import { Course, CourseSchema } from 'src/course/entities/course.entity';
import { CourseService } from 'src/course/course.service';
import { CourseModule } from 'src/course/course.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Skill.name, schema: SkillSchema },
      { name: Course.name, schema: CourseSchema },
    ]),
  ],
  providers: [SkillResolver, SkillService, CourseService],
  exports: [SkillService],
})
export class SkillModule {}
