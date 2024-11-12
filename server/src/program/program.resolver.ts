import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ProgramService } from './program.service';
import { Program } from './entities/program.entity';
import { CreateProgramInput } from './dto/create-program.input';
import { UpdateProgramInput } from './dto/update-program.input';
import { Schema as MongooseSchema } from 'mongoose';

@Resolver(() => Program)
export class ProgramResolver {
  constructor(private readonly programService: ProgramService) {}

  @Mutation(() => Program)
  createProgram(
    @Args('createProgramInput') createProgramInput: CreateProgramInput,
  ) {
    return this.programService.create(createProgramInput);
  }

  @Query(() => [Program], { name: 'program' })
  findAll() {
    return this.programService.findAll();
  }

  @Query(() => Program, { name: 'program' })
  findOne(
    @Args('id', { type: () => String }) id: MongooseSchema.Types.ObjectId,
  ) {
    return this.programService.findOne(id);
  }

  @Mutation(() => Program)
  updateProgram(
    @Args('updateProgramInput') updateProgramInput: UpdateProgramInput,
  ) {
    return this.programService.update(
      updateProgramInput._id,
      updateProgramInput,
    );
  }

  @Mutation(() => Program)
  removeProgram(
    @Args('id', { type: () => String }) id: MongooseSchema.Types.ObjectId,
  ) {
    return this.programService.remove(id);
  }
}
