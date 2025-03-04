import { Module } from '@nestjs/common';
import { CoursemetadataService } from './coursemetadata.service';
import { CoursemetadataResolver } from './coursemetadata.resolver';

@Module({
  providers: [CoursemetadataResolver, CoursemetadataService],
})
export class CoursemetadataModule {}
