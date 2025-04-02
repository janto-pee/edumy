import { Module } from '@nestjs/common';
import { CoursemetadataService } from './coursemetadata.service';
import { CoursemetadataResolver } from './coursemetadata.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Coursemetada,
  CoursemetadaSchema,
} from './entities/coursemetadatum.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Coursemetada.name, schema: CoursemetadaSchema },
    ]),
  ],
  providers: [CoursemetadataResolver, CoursemetadataService],
})
export class CoursemetadataModule {}
