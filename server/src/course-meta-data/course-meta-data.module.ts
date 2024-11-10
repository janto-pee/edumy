import { Module } from '@nestjs/common';
import { CourseMetaDataService } from './course-meta-data.service';
import { CourseMetaDataResolver } from './course-meta-data.resolver';

@Module({
  providers: [CourseMetaDataResolver, CourseMetaDataService],
})
export class CourseMetaDataModule {}
