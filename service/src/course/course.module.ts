import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseResolver } from './course.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Course, CourseSchema } from './entities/course.entity';
import { Skill, SkillSchema } from 'src/skill/entities/skill.entity';
import { Content, ContentSchema } from 'src/content/entities/content.entity';
import {
  Coursemetada,
  CoursemetadaSchema,
} from 'src/coursemetadata/entities/coursemetadatum.entity';
import { SkillService } from 'src/skill/skill.service';
import { ContentService } from 'src/content/content.service';
import { CoursemetadataService } from 'src/coursemetadata/coursemetadata.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Course.name, schema: CourseSchema },
      { name: Skill.name, schema: SkillSchema },
      { name: Content.name, schema: ContentSchema },
      { name: Coursemetada.name, schema: CoursemetadaSchema },
    ]),
  ],
  providers: [
    CourseResolver,
    CourseService,
    SkillService,
    ContentService,
    CoursemetadataService,
  ],
})
export class CourseModule {}
