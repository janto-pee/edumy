import { Injectable } from '@nestjs/common';
import * as DataLoader from 'dataloader';
import { ProgramService } from './program.service';
import { Program } from './entities/program.entity';

@Injectable()
export class ProgramLoaderService {
  constructor(private readonly programService: ProgramService) {}

  createProgramsLoader() {
    return new DataLoader<string, Program>(async (ids: any) => {
      // return new DataLoader<string, Program>(async (ids: string[]) => {
      const programs = await this.programService.findByIds(ids);
      const programsMap = new Map(
        programs.map((program) => [program._id.toString(), program]),
      );
      return ids.map((id) => programsMap.get(id) || null);
    });
  }
}
