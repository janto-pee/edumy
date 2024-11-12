import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ProgramMembershipService } from './program-membership.service';
import { ProgramMembership } from './entities/program-membership.entity';
import { CreateProgramMembershipInput } from './dto/create-program-membership.input';
import { UpdateProgramMembershipInput } from './dto/update-program-membership.input';
import { Schema as MongooseSchema } from 'mongoose';

@Resolver(() => ProgramMembership)
export class ProgramMembershipResolver {
  constructor(
    private readonly programMembershipService: ProgramMembershipService,
  ) {}

  @Mutation(() => ProgramMembership)
  createProgramMembership(
    @Args('createProgramMembershipInput')
    createProgramMembershipInput: CreateProgramMembershipInput,
  ) {
    return this.programMembershipService.create(createProgramMembershipInput);
  }

  @Query(() => [ProgramMembership], { name: 'programMembership' })
  findAll() {
    return this.programMembershipService.findAll();
  }

  @Query(() => ProgramMembership, { name: 'programMembership' })
  findOne(
    @Args('id', { type: () => String }) id: MongooseSchema.Types.ObjectId,
  ) {
    return this.programMembershipService.findOne(id);
  }

  @Mutation(() => ProgramMembership)
  updateProgramMembership(
    @Args('updateProgramMembershipInput')
    updateProgramMembershipInput: UpdateProgramMembershipInput,
  ) {
    return this.programMembershipService.update(
      updateProgramMembershipInput._id,
      updateProgramMembershipInput,
    );
  }

  @Mutation(() => ProgramMembership)
  removeProgramMembership(
    @Args('id', { type: () => String }) id: MongooseSchema.Types.ObjectId,
  ) {
    return this.programMembershipService.remove(id);
  }
}
