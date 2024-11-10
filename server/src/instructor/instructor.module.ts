import { Module } from '@nestjs/common';
import { InstructorService } from './instructor.service';
import { InstructorResolver } from './instructor.resolver';

@Module({
  providers: [InstructorResolver, InstructorService],
})
export class InstructorModule {}
