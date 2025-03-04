import { Module } from '@nestjs/common';
import { ProgrammembershipService } from './programmembership.service';
import { ProgramMembershipResolver } from './programmembership.resolver';
import {
  ProgramMembership,
  ProgramMembershipSchema,
} from './entities/programmembership.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProgramMembership.name, schema: ProgramMembershipSchema },
    ]),
  ],

  providers: [ProgramMembershipResolver, ProgrammembershipService],
})
export class ProgrammembershipModule {}
