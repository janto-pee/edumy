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
import { CourseMetaDatumService } from './coursemetadata.service';
import { CourseMetaDatum } from './entities/coursemetadatum.entity';
import { CreateCourseMetaDatumInput } from './dto/create-coursemetadatum.input';
import {
  UpdateBulkCourseMetaDatumInput,
  UpdateCourseMetaDatumInput,
} from './dto/update-coursemetadatum.input';
import { CourseMetaDatumPaginationResponse } from './dto/pagination-response';
import { CourseMetaDatumFilterDto } from './dto/filter-coursemetadatum';
import { RolesGuard } from 'src/auth/role.gurad';
import { PubSub } from 'graphql-subscriptions';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { User } from 'src/user/entities/user.entity';

@Resolver(() => CourseMetaDatum)
export class CourseMetaDatumResolver {
  private readonly logger = new Logger(CourseMetaDatumResolver.name);

  constructor(
    private readonly courseMetaDatumService: CourseMetaDatumService,
    @Inject('PUB_SUB') private pubSub: PubSub,
  ) {}

  @Mutation(() => CourseMetaDatum)
  @UseGuards(GqlAuthGuard)
  async createCourseMetaDatum(
    @Args('createCourseMetaDatumInput')
    createCourseMetaDatumInput: CreateCourseMetaDatumInput,
    @CurrentUser() user: User,
  ) {
    try {
      const courseMetaDatum = await this.courseMetaDatumService.create({
        ...createCourseMetaDatumInput,
        createdBy: user._id,
      });
      this.pubSub.publish('courseMetaDatumCreated', {
        courseMetaDatumCreated: courseMetaDatum,
      });
      return courseMetaDatum;
    } catch (error) {
      this.logger.error(
        `Failed to create courseMetaDatum: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Query(() => CourseMetaDatumPaginationResponse, { name: 'courseMetaDatums' })
  async findAll(
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
  ) {
    try {
      return await this.courseMetaDatumService.findAll(page, limit);
    } catch (error) {
      this.logger.error(
        `Failed to fetch courseMetaDatums: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Query(() => CourseMetaDatumPaginationResponse, {
    name: 'filteredCourseMetaDatums',
  })
  async findWithFilters(
    @Args('filter') filter: CourseMetaDatumFilterDto,
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
  ) {
    try {
      return await this.courseMetaDatumService.findWithFilters(
        filter,
        page,
        limit,
      );
    } catch (error) {
      this.logger.error(
        `Failed to fetch filtered courseMetaDatums: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Query(() => CourseMetaDatum, { name: 'courseMetaDatum' })
  async findOne(@Args('id', { type: () => String }) id: string) {
    try {
      return await this.courseMetaDatumService.findOne(id);
    } catch (error) {
      this.logger.error(
        `Failed to fetch courseMetaDatum with id ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Query(() => [CourseMetaDatum], { name: 'searchCourseMetaDatums' })
  async searchCourseMetaDatums(
    @Args('searchTerm', { type: () => String }) searchTerm: string,
  ) {
    try {
      return await this.courseMetaDatumService.searchCourseMetaDatums(
        searchTerm,
      );
    } catch (error) {
      this.logger.error(
        `Failed to search courseMetaDatums with term '${searchTerm}': ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  // @Query(() => Object, { name: 'courseMetaDatumStatistics' })
  // @UseGuards(GqlAuthGuard, RolesGuard)
  // @Roles('ADMIN', 'INSTRUCTOR')
  // async getCourseMetaDatumStatistics() {
  //   try {
  //     return await this.courseMetaDatumService.getCourseMetaDatumStatistics();
  //   } catch (error) {
  //     this.logger.error(
  //       `Failed to get courseMetaDatum statistics: ${error.message}`,
  //       error.stack,
  //     );
  //     throw error;
  //   }
  // }

  @Mutation(() => CourseMetaDatum)
  @UseGuards(GqlAuthGuard)
  async updateCourseMetaDatum(
    @Args('updateCourseMetaDatumInput')
    updateCourseMetaDatumInput: UpdateCourseMetaDatumInput,
    @CurrentUser() user: User,
  ) {
    try {
      const courseMetaDatum = await this.courseMetaDatumService.update(
        updateCourseMetaDatumInput.id,
        updateCourseMetaDatumInput,
      );
      this.pubSub.publish('courseMetaDatumUpdated', {
        courseMetaDatumUpdated: courseMetaDatum,
      });
      return courseMetaDatum;
    } catch (error) {
      this.logger.error(
        `Failed to update courseMetaDatum: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Mutation(() => [CourseMetaDatum])
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN', 'INSTRUCTOR')
  async createManyCourseMetaDatums(
    @Args('createCourseMetaDatumInputs', {
      type: () => [CreateCourseMetaDatumInput],
    })
    createCourseMetaDatumInputs: CreateCourseMetaDatumInput[],
    @CurrentUser() user: User,
  ) {
    try {
      const courseMetaDatumsWithCreator = createCourseMetaDatumInputs.map(
        (input) => ({
          ...input,
          createdBy: user._id,
        }),
      );
      return await this.courseMetaDatumService.createMany(
        courseMetaDatumsWithCreator,
      );
    } catch (error) {
      this.logger.error(
        `Failed to create multiple courseMetaDatums: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Mutation(() => Int)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN', 'INSTRUCTOR')
  async updateManyCourseMetaDatums(
    @Args('updates', { type: () => [UpdateBulkCourseMetaDatumInput] })
    updates: { id: string; data: Partial<UpdateCourseMetaDatumInput> }[],
  ) {
    try {
      return await this.courseMetaDatumService.updateMany(updates);
    } catch (error) {
      this.logger.error(
        `Failed to update multiple courseMetaDatums: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Mutation(() => CourseMetaDatum)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async removeCourseMetaDatum(@Args('id', { type: () => String }) id: string) {
    try {
      const courseMetaDatum = await this.courseMetaDatumService.remove(id);
      this.pubSub.publish('courseMetaDatumDeleted', {
        courseMetaDatumDeleted: courseMetaDatum,
      });
      return courseMetaDatum;
    } catch (error) {
      this.logger.error(
        `Failed to remove courseMetaDatum with id ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async bulkDeleteCourseMetaDatums(
    @Args('ids', { type: () => [String] }) ids: string[],
  ) {
    try {
      const result = await this.courseMetaDatumService.bulkDelete(ids);
      return result;
    } catch (error) {
      this.logger.error(
        `Failed to bulk delete courseMetaDatums: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Query(() => [CourseMetaDatum], { name: 'popularCourseMetaDatums' })
  async getPopularCourseMetaDatums(
    @Args('limit', { type: () => Int, defaultValue: 5 }) limit: number,
  ) {
    try {
      return await this.courseMetaDatumService.getPopularCourseMetaDatums(
        limit,
      );
    } catch (error) {
      this.logger.error(
        `Failed to fetch popular courseMetaDatums: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Query(() => [CourseMetaDatum], { name: 'recentCourseMetaDatums' })
  async getRecentCourseMetaDatums(
    @Args('limit', { type: () => Int, defaultValue: 5 }) limit: number,
  ) {
    try {
      return await this.courseMetaDatumService.getRecentCourseMetaDatums(limit);
    } catch (error) {
      this.logger.error(
        `Failed to fetch recent courseMetaDatums: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * RESOLVER FIELDS
   */

  @ResolveField()
  async creator(@Parent() courseMetaDatum: CourseMetaDatum) {
    try {
      const { createdBy } = courseMetaDatum;
      if (!createdBy) return null;
      // Assuming you have a user service to fetch user details
      // return await this.userService.findOne(createdBy);
      return null; // Replace with actual implementation
    } catch (error) {
      this.logger.error(
        `Failed to resolve creator for courseMetaDatum: ${error.message}`,
        error.stack,
      );
      return null;
    }
  }

  /**
   * Subscriptions
   * for real time updates
   */
  @Subscription(() => CourseMetaDatum)
  courseMetaDatumCreated() {
    return this.pubSub.asyncIterableIterator('courseMetaDatumCreated');
  }

  @Subscription(() => CourseMetaDatum)
  courseMetaDatumUpdated() {
    return this.pubSub.asyncIterableIterator('courseMetaDatumUpdated');
  }

  @Subscription(() => CourseMetaDatum)
  courseMetaDatumDeleted() {
    return this.pubSub.asyncIterableIterator('courseMetaDatumDeleted');
  }
}
