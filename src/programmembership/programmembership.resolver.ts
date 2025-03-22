import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { ProgrammembershipService } from './programmembership.service';
import { ProgramMembership } from './entities/programmembership.entity';
import { CreateProgrammembershipInput } from './dto/create-programmembership.input';
import { UpdateProgrammembershipInput } from './dto/update-programmembership.input';
import { Program } from 'src/program/entities/program.entity';
import { ProgramService } from 'src/program/program.service';

@Resolver(() => ProgramMembership)
export class ProgramMembershipResolver {
  constructor(
    private readonly programMembershipService: ProgrammembershipService,
    private readonly programService: ProgramService,
  ) {}

  @Mutation(() => ProgramMembership)
  async createProgramMembership(
    @Args('createProgramMembershipInput')
    createProgramMembershipInput: CreateProgrammembershipInput,
  ) {
    return await this.programMembershipService.create(
      createProgramMembershipInput,
    );
  }

  @Query(() => [ProgramMembership], { name: 'programMemberships' })
  async findAll() {
    return await this.programMembershipService.findAll();
  }

  @Query(() => ProgramMembership, { name: 'programMembership' })
  async findOne(@Args('id', { type: () => String }) id: string) {
    return await this.programMembershipService.findOne(id);
  }

  @Mutation(() => ProgramMembership)
  async updateProgramMembership(
    @Args('updateProgramMembershipInput')
    updateProgramMembershipInput: UpdateProgrammembershipInput,
  ) {
    return await this.programMembershipService.update(
      updateProgramMembershipInput.id,
      updateProgramMembershipInput,
    );
  }

  @Mutation(() => ProgramMembership)
  async removeProgrammembership(
    @Args('id', { type: () => String }) id: string,
  ) {
    return await this.programMembershipService.remove(id);
  }

  // @ResolveField(() => Program)
  // async program(@Parent() programMembership: ProgramMembership) {
  //   return await this.programService.findOne(programMembership.program._id);
  // }
}
