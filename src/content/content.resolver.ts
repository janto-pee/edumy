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
import { ContentService } from 'src/content/content.service';
import { Content } from './entities/content.entity';
import { CreateContentInput } from './dto/create-content.input';
import {
  UpdateBulkContentInput,
  UpdateContentInput,
} from './dto/update-content.input';
import { ContentPaginationResponse } from './dto/pagination-response';
import { RolesGuard } from 'src/auth/role.gurad';
import { PubSub } from 'graphql-subscriptions';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { ContentFilterDto } from './dto/filter-content';

@Resolver(() => Content)
export class ContentResolver {
  private readonly logger = new Logger(ContentResolver.name);

  constructor(
    private readonly contentService: ContentService,
    @Inject('PUB_SUB') private pubSub: PubSub,
  ) {}

  @Mutation(() => Content)
  @UseGuards(GqlAuthGuard)
  async createContent(
    @Args('createContentInput') createContentInput: CreateContentInput,
    @CurrentUser() user: User,
  ) {
    try {
      const content = await this.contentService.create({
        ...createContentInput,
        createdBy: user._id,
      });
      this.pubSub.publish('contentCreated', { contentCreated: content });
      return content;
    } catch (error) {
      this.logger.error(
        `Failed to create content: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Query(() => ContentPaginationResponse, { name: 'contents' })
  async findAll(
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
  ) {
    try {
      return await this.contentService.findAll(page, limit);
    } catch (error) {
      this.logger.error(
        `Failed to fetch contents: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Query(() => ContentPaginationResponse, { name: 'filteredContents' })
  async findWithFilters(
    @Args('filter') filter: ContentFilterDto,
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
  ) {
    try {
      return await this.contentService.findWithFilters(filter, page, limit);
    } catch (error) {
      this.logger.error(
        `Failed to fetch filtered contents: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Query(() => Content, { name: 'content' })
  async findOne(@Args('id', { type: () => String }) id: string) {
    try {
      return await this.contentService.findOne(id);
    } catch (error) {
      this.logger.error(
        `Failed to fetch content with id ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Query(() => [Content], { name: 'searchContents' })
  async searchContents(
    @Args('searchTerm', { type: () => String }) searchTerm: string,
  ) {
    try {
      return await this.contentService.searchContents(searchTerm);
    } catch (error) {
      this.logger.error(
        `Failed to search contents with term '${searchTerm}': ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  // @Query(() => Object, { name: 'contentStatistics' })
  // @UseGuards(GqlAuthGuard, RolesGuard)
  // @Roles('ADMIN', 'INSTRUCTOR')
  // async getContentStatistics() {
  //   try {
  //     return await this.contentService.getContentStatistics();
  //   } catch (error) {
  //     this.logger.error(
  //       `Failed to get content statistics: ${error.message}`,
  //       error.stack,
  //     );
  //     throw error;
  //   }
  // }

  @Mutation(() => Content)
  @UseGuards(GqlAuthGuard)
  async updateContent(
    @Args('updateContentInput') updateContentInput: UpdateContentInput,
    @CurrentUser() user: User,
  ) {
    try {
      const content = await this.contentService.update(
        updateContentInput.id,
        updateContentInput,
      );
      this.pubSub.publish('contentUpdated', { contentUpdated: content });
      return content;
    } catch (error) {
      this.logger.error(
        `Failed to update content: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Mutation(() => [Content])
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN', 'INSTRUCTOR')
  async createManyContents(
    @Args('createContentInputs', { type: () => [CreateContentInput] })
    createContentInputs: CreateContentInput[],
    @CurrentUser() user: User,
  ) {
    try {
      const contentsWithCreator = createContentInputs.map((input) => ({
        ...input,
        createdBy: user._id,
      }));
      return await this.contentService.createMany(contentsWithCreator);
    } catch (error) {
      this.logger.error(
        `Failed to create multiple contents: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Mutation(() => Int)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN', 'INSTRUCTOR')
  async updateManyContents(
    @Args('updates', { type: () => [UpdateBulkContentInput] })
    updates: { id: string; data: Partial<UpdateContentInput> }[],
  ) {
    try {
      return await this.contentService.updateMany(updates);
    } catch (error) {
      this.logger.error(
        `Failed to update multiple contents: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Mutation(() => Content)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async removeContent(@Args('id', { type: () => String }) id: string) {
    try {
      const content = await this.contentService.remove(id);
      this.pubSub.publish('contentDeleted', { contentDeleted: content });
      return content;
    } catch (error) {
      this.logger.error(
        `Failed to remove content with id ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async bulkDeleteContents(
    @Args('ids', { type: () => [String] }) ids: string[],
  ) {
    try {
      const result = await this.contentService.bulkDelete(ids);
      return result;
    } catch (error) {
      this.logger.error(
        `Failed to bulk delete contents: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Query(() => [Content], { name: 'popularContents' })
  async getPopularContents(
    @Args('limit', { type: () => Int, defaultValue: 5 }) limit: number,
  ) {
    try {
      return await this.contentService.getPopularContents(limit);
    } catch (error) {
      this.logger.error(
        `Failed to fetch popular contents: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Query(() => [Content], { name: 'recentContents' })
  async getRecentContents(
    @Args('limit', { type: () => Int, defaultValue: 5 }) limit: number,
  ) {
    try {
      return await this.contentService.getRecentContents(limit);
    } catch (error) {
      this.logger.error(
        `Failed to fetch recent contents: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * RESOLVER FIELDS
   */

  @ResolveField()
  async creator(@Parent() content: Content) {
    try {
      const { createdBy } = content;
      if (!createdBy) return null;
      // Assuming you have a user service to fetch user details
      // return await this.userService.findOne(createdBy);
      return null; // Replace with actual implementation
    } catch (error) {
      this.logger.error(
        `Failed to resolve creator for content: ${error.message}`,
        error.stack,
      );
      return null;
    }
  }

  /**
   * Subscriptions
   * for real time updates
   */
  @Subscription(() => Content)
  contentCreated() {
    return this.pubSub.asyncIterableIterator('contentCreated');
  }

  @Subscription(() => Content)
  contentUpdated() {
    return this.pubSub.asyncIterableIterator('contentUpdated');
  }

  @Subscription(() => Content)
  contentDeleted() {
    return this.pubSub.asyncIterableIterator('contentDeleted');
  }
}
