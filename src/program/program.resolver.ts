import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
  Int,
} from '@nestjs/graphql';
import { GqlAuthGuard } from 'src/auth/gqll-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Subscription } from '@nestjs/graphql';
import { Inject, Logger, UseGuards } from '@nestjs/common';
import { ProgramService } from './program.service';
import { Program } from './entities/program.entity';
import { CreateProgramInput } from './dto/create-program.input';
import {
  UpdateBulkProgramInput,
  UpdateProgramInput,
} from './dto/update-program.input';
import { ProgramPaginationResponse } from './dto/pagination-response';
import { ProgramFilterDto } from './dto/filter-program';
import { RolesGuard } from 'src/auth/role.gurad';
import { TrackProgramOperation } from './program-operation.decorator';
import { PubSub } from 'graphql-subscriptions';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { CourseService } from 'src/course/course.service';

@Resolver(() => Program)
export class ProgramResolver {
  private readonly logger = new Logger(ProgramResolver.name);

  constructor(
    private readonly programService: ProgramService,
    private readonly coursesService: CourseService,
    @Inject('PUB_SUB') private pubSub: PubSub,
  ) {}

  @Mutation(() => Program)
  @UseGuards(GqlAuthGuard)
  @TrackProgramOperation('create')
  async createProgram(
    @Args('createProgramInput') createProgramInput: CreateProgramInput,
    @CurrentUser() user: User,
  ) {
    try {
      const program = await this.programService.create({
        ...createProgramInput,
        createdBy: user._id,
      });
      this.pubSub.publish('programCreated', { programCreated: program });
      return program;
    } catch (error) {
      this.logger.error(
        `Failed to create program: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Query(() => ProgramPaginationResponse, { name: 'programs' })
  async findAll(
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
  ) {
    try {
      return await this.programService.findAll(page, limit);
    } catch (error) {
      this.logger.error(
        `Failed to fetch programs: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Query(() => ProgramPaginationResponse, { name: 'filteredPrograms' })
  async findWithFilters(
    @Args('filter') filter: ProgramFilterDto,
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
  ) {
    try {
      return await this.programService.findWithFilters(filter, page, limit);
    } catch (error) {
      this.logger.error(
        `Failed to fetch filtered programs: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Query(() => Program, { name: 'program' })
  @TrackProgramOperation('view')
  async findOne(@Args('id', { type: () => String }) id: string) {
    try {
      return await this.programService.findOne(id);
    } catch (error) {
      this.logger.error(
        `Failed to fetch program with id ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Query(() => [Program], { name: 'searchPrograms' })
  async searchPrograms(
    @Args('searchTerm', { type: () => String }) searchTerm: string,
  ) {
    try {
      return await this.programService.searchPrograms(searchTerm);
    } catch (error) {
      this.logger.error(
        `Failed to search programs with term '${searchTerm}': ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  // @Query(() => Object, { name: 'programStatistics' })
  // @UseGuards(GqlAuthGuard, RolesGuard)
  // @Roles('ADMIN', 'INSTRUCTOR')
  // async getProgramStatistics() {
  //   try {
  //     return await this.programService.getProgramStatistics();
  //   } catch (error) {
  //     this.logger.error(
  //       `Failed to get program statistics: ${error.message}`,
  //       error.stack,
  //     );
  //     throw error;
  //   }
  // }

  @Mutation(() => Program)
  @UseGuards(GqlAuthGuard)
  @TrackProgramOperation('update')
  async updateProgram(
    @Args('updateProgramInput') updateProgramInput: UpdateProgramInput,
    @CurrentUser() user: User,
  ) {
    try {
      const program = await this.programService.update(
        updateProgramInput.id,
        updateProgramInput,
      );
      this.pubSub.publish('programUpdated', { programUpdated: program });
      return program;
    } catch (error) {
      this.logger.error(
        `Failed to update program: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Mutation(() => [Program])
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN', 'INSTRUCTOR')
  async createManyPrograms(
    @Args('createProgramInputs', { type: () => [CreateProgramInput] })
    createProgramInputs: CreateProgramInput[],
    @CurrentUser() user: User,
  ) {
    try {
      const programsWithCreator = createProgramInputs.map((input) => ({
        ...input,
        createdBy: user._id,
      }));
      return await this.programService.createMany(programsWithCreator);
    } catch (error) {
      this.logger.error(
        `Failed to create multiple programs: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Mutation(() => Int)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN', 'INSTRUCTOR')
  async updateManyPrograms(
    @Args('updates', { type: () => [UpdateBulkProgramInput] })
    updates: { id: string; data: Partial<UpdateProgramInput> }[],
  ) {
    try {
      return await this.programService.updateMany(updates);
    } catch (error) {
      this.logger.error(
        `Failed to update multiple programs: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Mutation(() => Program)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @TrackProgramOperation('delete')
  async removeProgram(@Args('id', { type: () => String }) id: string) {
    try {
      const program = await this.programService.remove(id);
      this.pubSub.publish('programDeleted', { programDeleted: program });
      return program;
    } catch (error) {
      this.logger.error(
        `Failed to remove program with id ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async bulkDeletePrograms(
    @Args('ids', { type: () => [String] }) ids: string[],
  ) {
    try {
      const result = await this.programService.bulkDelete(ids);
      return result;
    } catch (error) {
      this.logger.error(
        `Failed to bulk delete programs: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Query(() => [Program], { name: 'popularPrograms' })
  async getPopularPrograms(
    @Args('limit', { type: () => Int, defaultValue: 5 }) limit: number,
  ) {
    try {
      return await this.programService.getPopularPrograms(limit);
    } catch (error) {
      this.logger.error(
        `Failed to fetch popular programs: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Query(() => [Program], { name: 'recentPrograms' })
  async getRecentPrograms(
    @Args('limit', { type: () => Int, defaultValue: 5 }) limit: number,
  ) {
    try {
      return await this.programService.getRecentPrograms(limit);
    } catch (error) {
      this.logger.error(
        `Failed to fetch recent programs: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * RESOLVER FIELDS
   */
  @ResolveField()
  async courses(@Parent() program: Program) {
    try {
      const { _id } = program;
      if (!_id) return null;
      return await this.coursesService.findCourseByProgram(_id);
    } catch (error) {
      this.logger.error(
        `Failed to resolve skills for program: ${error.message}`,
        error.stack,
      );
      return null;
    }
  }

  @ResolveField()
  async creator(@Parent() program: Program) {
    try {
      const { createdBy } = program;
      if (!createdBy) return null;
      // Assuming you have a user service to fetch user details
      // return await this.userService.findOne(createdBy);
      return null; // Replace with actual implementation
    } catch (error) {
      this.logger.error(
        `Failed to resolve creator for program: ${error.message}`,
        error.stack,
      );
      return null;
    }
  }

  /**
   * Subscriptions
   * for real time updates
   */
  @Subscription(() => Program)
  programCreated() {
    return this.pubSub.asyncIterableIterator('programCreated');
  }

  @Subscription(() => Program)
  programUpdated() {
    return this.pubSub.asyncIterableIterator('programUpdated');
  }

  @Subscription(() => Program)
  programDeleted() {
    return this.pubSub.asyncIterableIterator('programDeleted');
  }
}
