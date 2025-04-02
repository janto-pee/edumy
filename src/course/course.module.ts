import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseResolver } from './course.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { SkillModule } from 'src/skill/skill.module';
import { CoursemetadataModule } from 'src/coursemetadata/coursemetadata.module';
import { ContentModule } from 'src/content/content.module';
import { CourseLoaderService } from './course-loader.service';
import { SkillService } from 'src/skill/skill.service';
import { ContentService } from 'src/content/content.service';

import { Course, CourseSchema } from './entities/course.entity';
import { Skill, SkillSchema } from 'src/skill/entities/skill.entity';
import { Content, ContentSchema } from 'src/content/entities/content.entity';
import {
  CourseMetaDatum,
  CourseMetaDatumSchema,
} from 'src/coursemetadata/entities/coursemetadatum.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Course.name, schema: CourseSchema },
      { name: Skill.name, schema: SkillSchema },
      { name: Content.name, schema: ContentSchema },
      { name: CourseMetaDatum.name, schema: CourseMetaDatumSchema },
    ]),
    SkillModule,
    CoursemetadataModule,
    ContentModule,
  ],
  providers: [
    CourseResolver,
    CourseService,
    CourseLoaderService,
    SkillService,
    // CoursemetadataService,
    ContentService,
  ],
  exports: [CourseService, CourseLoaderService],
})
export class CourseModule {}
