import { Module } from '@nestjs/common';
import { EnrollmentStateService } from './enrollment-state.service';
import { EnrollmentStateResolver } from './enrollment-state.resolver';

@Module({
  providers: [EnrollmentStateResolver, EnrollmentStateService],
})
export class EnrollmentStateModule {}
