import { Module } from '@nestjs/common';
import { CourseMetaDataService } from './course-meta-data.service';
import { CourseMetaDataResolver } from './course-meta-data.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CourseMetaDatum,
  CourseMetaDatumSchema,
} from './entities/course-meta-datum.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CourseMetaDatum.name, schema: CourseMetaDatumSchema },
    ]),
  ],
  providers: [CourseMetaDataResolver, CourseMetaDataService],
})
export class CourseMetaDataModule {}
