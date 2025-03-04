import { Module } from '@nestjs/common';
import { ProgrammembershipService } from './programmembership.service';
import { ProgramMembershipResolver } from './programmembership.resolver';

@Module({
  providers: [ProgramMembershipResolver, ProgrammembershipService],
})
export class ProgrammembershipModule {}
