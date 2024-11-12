import { Module } from '@nestjs/common';
import { ProgramMembershipService } from './program-membership.service';
import { ProgramMembershipResolver } from './program-membership.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ProgramMembership,
  ProgramMembershipSchema,
} from './entities/program-membership.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProgramMembership.name, schema: ProgramMembershipSchema },
    ]),
  ],
  providers: [ProgramMembershipResolver, ProgramMembershipService],
})
export class ProgramMembershipModule {}
