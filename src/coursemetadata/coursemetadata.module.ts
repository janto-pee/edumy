import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CourseMetaDatum,
  CourseMetaDatumSchema,
} from './entities/coursemetadatum.entity';
import { CourseMetaDatumResolver } from './coursemetadata.resolver';
import { CourseMetaDatumService } from './coursemetadata.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CourseMetaDatum.name, schema: CourseMetaDatumSchema },
    ]),
  ],
  providers: [CourseMetaDatumResolver, CourseMetaDatumService],
})
export class CoursemetadataModule {}
