import { Module } from '@nestjs/common';
import { ProgramService } from './program.service';
import { ProgramResolver } from './program.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Program, ProgramSchema } from './entities/program.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Program.name, schema: ProgramSchema }]),
  ],
  providers: [ProgramResolver, ProgramService],
})
export class ProgramModule {}
