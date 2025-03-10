import { Module } from '@nestjs/common';
import { ProgrammembershipService } from './programmembership.service';
import { ProgramMembershipResolver } from './programmembership.resolver';
import {
  ProgramMembership,
  ProgramMembershipSchema,
} from './entities/programmembership.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { Program, ProgramSchema } from 'src/program/entities/program.entity';
import { ProgramService } from 'src/program/program.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProgramMembership.name, schema: ProgramMembershipSchema },
      { name: Program.name, schema: ProgramSchema },
    ]),
  ],

  providers: [
    ProgramMembershipResolver,
    ProgrammembershipService,
    ProgramService,
  ],
})
export class ProgrammembershipModule {}
