import { Module } from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { EnrollmentResolver } from './enrollment.resolver';

@Module({
  providers: [EnrollmentResolver, EnrollmentService],
})
export class EnrollmentModule {}
