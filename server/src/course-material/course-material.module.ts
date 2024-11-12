import { Module } from '@nestjs/common';
import { CourseMaterialService } from './course-material.service';
import { CourseMaterialResolver } from './course-material.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CourseMaterial,
  CourseMaterialSchema,
} from './entities/course-material.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CourseMaterial.name, schema: CourseMaterialSchema },
    ]),
  ],
  providers: [CourseMaterialResolver, CourseMaterialService],
})
export class CourseMaterialModule {}
