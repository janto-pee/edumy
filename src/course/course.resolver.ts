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
import { CourseService } from './course.service';
import { Course } from './entities/course.entity';
import { CreateCourseInput } from './dto/create-course.input';
import {
  UpdateBulkCourseInput,
  UpdateCourseInput,
} from './dto/update-course.input';
import { SkillService } from 'src/skill/skill.service';
import { ContentService } from 'src/content/content.service';
import { CoursePaginationResponse } from './dto/pagination-response';
import { CourseFilterDto } from './dto/filter-course';
import { RolesGuard } from 'src/auth/role.gurad';
import { TrackCourseOperation } from './course-operation.decorator';
import { PubSub } from 'graphql-subscriptions';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { User } from 'src/user/entities/user.entity';

@Resolver(() => Course)
export class CourseResolver {
  private readonly logger = new Logger(CourseResolver.name);

  constructor(
    private readonly courseService: CourseService,
    private readonly skillService: SkillService,
    private readonly contentService: ContentService,
    @Inject('PUB_SUB') private pubSub: PubSub,
  ) {}

  @Mutation(() => Course)
  @UseGuards(GqlAuthGuard)
  @TrackCourseOperation('create')
  async createCourse(
    @Args('createCourseInput') createCourseInput: CreateCourseInput,
    @CurrentUser() user: User,
  ) {
    try {
      const course = await this.courseService.create({
        ...createCourseInput,
        createdBy: user._id,
      });
      this.pubSub.publish('courseCreated', { courseCreated: course });
      return course;
    } catch (error) {
      this.logger.error(
        `Failed to create course: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Query(() => CoursePaginationResponse, { name: 'courses' })
  async findAll(
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
  ) {
    try {
      return await this.courseService.findAll(page, limit);
    } catch (error) {
      this.logger.error(
        `Failed to fetch courses: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Query(() => CoursePaginationResponse, { name: 'filteredCourses' })
  async findWithFilters(
    @Args('filter') filter: CourseFilterDto,
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
  ) {
    try {
      return await this.courseService.findWithFilters(filter, page, limit);
    } catch (error) {
      this.logger.error(
        `Failed to fetch filtered courses: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Query(() => Course, { name: 'course' })
  @TrackCourseOperation('view')
  async findOne(@Args('id', { type: () => String }) id: string) {
    try {
      return await this.courseService.findOne(id);
    } catch (error) {
      this.logger.error(
        `Failed to fetch course with id ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Query(() => [Course], { name: 'searchCourses' })
  async searchCourses(
    @Args('searchTerm', { type: () => String }) searchTerm: string,
  ) {
    try {
      return await this.courseService.searchCourses(searchTerm);
    } catch (error) {
      this.logger.error(
        `Failed to search courses with term '${searchTerm}': ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  // @Query(() => Object, { name: 'courseStatistics' })
  // @UseGuards(GqlAuthGuard, RolesGuard)
  // @Roles('ADMIN', 'INSTRUCTOR')
  // async getCourseStatistics() {
  //   try {
  //     return await this.courseService.getCourseStatistics();
  //   } catch (error) {
  //     this.logger.error(
  //       `Failed to get course statistics: ${error.message}`,
  //       error.stack,
  //     );
  //     throw error;
  //   }
  // }

  @Mutation(() => Course)
  @UseGuards(GqlAuthGuard)
  @TrackCourseOperation('update')
  async updateCourse(
    @Args('updateCourseInput') updateCourseInput: UpdateCourseInput,
    @CurrentUser() user: User,
  ) {
    try {
      const course = await this.courseService.update(
        updateCourseInput.id,
        updateCourseInput,
      );
      this.pubSub.publish('courseUpdated', { courseUpdated: course });
      return course;
    } catch (error) {
      this.logger.error(
        `Failed to update course: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Mutation(() => [Course])
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN', 'INSTRUCTOR')
  async createManyCourses(
    @Args('createCourseInputs', { type: () => [CreateCourseInput] })
    createCourseInputs: CreateCourseInput[],
    @CurrentUser() user: User,
  ) {
    try {
      const coursesWithCreator = createCourseInputs.map((input) => ({
        ...input,
        createdBy: user._id,
      }));
      return await this.courseService.createMany(coursesWithCreator);
    } catch (error) {
      this.logger.error(
        `Failed to create multiple courses: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Mutation(() => Int)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN', 'INSTRUCTOR')
  async updateManyCourses(
    @Args('updates', { type: () => [UpdateBulkCourseInput] })
    updates: { id: string; data: Partial<UpdateCourseInput> }[],
  ) {
    try {
      return await this.courseService.updateMany(updates);
    } catch (error) {
      this.logger.error(
        `Failed to update multiple courses: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Mutation(() => Course)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @TrackCourseOperation('delete')
  async removeCourse(@Args('id', { type: () => String }) id: string) {
    try {
      const course = await this.courseService.remove(id);
      this.pubSub.publish('courseDeleted', { courseDeleted: course });
      return course;
    } catch (error) {
      this.logger.error(
        `Failed to remove course with id ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async bulkDeleteCourses(
    @Args('ids', { type: () => [String] }) ids: string[],
  ) {
    try {
      const result = await this.courseService.bulkDelete(ids);
      return result;
    } catch (error) {
      this.logger.error(
        `Failed to bulk delete courses: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Query(() => [Course], { name: 'popularCourses' })
  async getPopularCourses(
    @Args('limit', { type: () => Int, defaultValue: 5 }) limit: number,
  ) {
    try {
      return await this.courseService.getPopularCourses(limit);
    } catch (error) {
      this.logger.error(
        `Failed to fetch popular courses: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Query(() => [Course], { name: 'recentCourses' })
  async getRecentCourses(
    @Args('limit', { type: () => Int, defaultValue: 5 }) limit: number,
  ) {
    try {
      return await this.courseService.getRecentCourses(limit);
    } catch (error) {
      this.logger.error(
        `Failed to fetch recent courses: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * RESOLVER FIELDS
   */
  @ResolveField()
  async skills(@Parent() course: Course) {
    try {
      const { skillId } = course;
      if (!skillId) return null;
      return await this.skillService.findOne(skillId);
    } catch (error) {
      this.logger.error(
        `Failed to resolve skills for course: ${error.message}`,
        error.stack,
      );
      return null;
    }
  }

  @ResolveField()
  async content(@Parent() course: Course) {
    try {
      const { contentId } = course;
      if (!contentId) return null;
      return await this.contentService.findOne(contentId);
    } catch (error) {
      this.logger.error(
        `Failed to resolve content for course: ${error.message}`,
        error.stack,
      );
      return null;
    }
  }

  @ResolveField()
  async creator(@Parent() course: Course) {
    try {
      const { createdBy } = course;
      if (!createdBy) return null;
      // Assuming you have a user service to fetch user details
      // return await this.userService.findOne(createdBy);
      return null; // Replace with actual implementation
    } catch (error) {
      this.logger.error(
        `Failed to resolve creator for course: ${error.message}`,
        error.stack,
      );
      return null;
    }
  }

  /**
   * Subscriptions
   * for real time updates
   */
  @Subscription(() => Course)
  courseCreated() {
    return this.pubSub.asyncIterableIterator('courseCreated');
  }

  @Subscription(() => Course)
  courseUpdated() {
    return this.pubSub.asyncIterableIterator('courseUpdated');
  }

  @Subscription(() => Course)
  courseDeleted() {
    return this.pubSub.asyncIterableIterator('courseDeleted');
  }
}
