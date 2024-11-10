import { Module } from '@nestjs/common';
import { ProgramMembershipService } from './program-membership.service';
import { ProgramMembershipResolver } from './program-membership.resolver';

@Module({
  providers: [ProgramMembershipResolver, ProgramMembershipService],
})
export class ProgramMembershipModule {}
