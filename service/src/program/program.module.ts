import { Module } from '@nestjs/common';
import { ProgramService } from './program.service';
import { ProgramResolver } from './program.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Program, ProgramSchema } from './entities/program.entity';
import { Course, CourseSchema } from 'src/course/entities/course.entity';
import { CourseService } from 'src/course/course.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Program.name, schema: ProgramSchema },
      { name: Course.name, schema: CourseSchema },
    ]),
  ],
  providers: [ProgramResolver, CourseService, ProgramService],
})
export class ProgramModule {}
