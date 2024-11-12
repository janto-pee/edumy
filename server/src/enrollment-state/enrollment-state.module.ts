import { Module } from '@nestjs/common';
import { EnrollmentStateService } from './enrollment-state.service';
import { EnrollmentStateResolver } from './enrollment-state.resolver';
import {
  EnrollmentState,
  EnrollmentStateSchema,
} from './entities/enrollment-state.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EnrollmentState.name, schema: EnrollmentStateSchema },
    ]),
  ],
  providers: [EnrollmentStateResolver, EnrollmentStateService],
})
export class EnrollmentStateModule {}
