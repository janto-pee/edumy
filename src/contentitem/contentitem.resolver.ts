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
import { ContentItemService } from './contentitem.service';
import { ContentItem } from './entities/contentitem.entity';
import { CreateContentItemInput } from './dto/create-contentitem.input';
import {
  UpdateBulkContentItemInput,
  UpdateContentItemInput,
} from './dto/update-contentitem.input';
import { ContentItemPaginationResponse } from './dto/pagination-response';
import { ContentItemFilterDto } from './dto/filter-contentitem';
import { RolesGuard } from 'src/auth/role.gurad';
import { PubSub } from 'graphql-subscriptions';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { User } from 'src/user/entities/user.entity';

@Resolver(() => ContentItem)
export class ContentItemResolver {
  private readonly logger = new Logger(ContentItemResolver.name);

  constructor(
    private readonly contentItemService: ContentItemService,
    @Inject('PUB_SUB') private pubSub: PubSub,
  ) {}

  @Mutation(() => ContentItem)
  @UseGuards(GqlAuthGuard)
  async createContentItem(
    @Args('createContentItemInput')
    createContentItemInput: CreateContentItemInput,
    @CurrentUser() user: User,
  ) {
    try {
      const contentItem = await this.contentItemService.create({
        ...createContentItemInput,
        createdBy: user._id,
      });
      this.pubSub.publish('contentItemCreated', {
        contentItemCreated: contentItem,
      });
      return contentItem;
    } catch (error) {
      this.logger.error(
        `Failed to create contentItem: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Query(() => ContentItemPaginationResponse, { name: 'contentItems' })
  async findAll(
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
  ) {
    try {
      return await this.contentItemService.findAll(page, limit);
    } catch (error) {
      this.logger.error(
        `Failed to fetch contentItems: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Query(() => ContentItemPaginationResponse, { name: 'filteredContentItems' })
  async findWithFilters(
    @Args('filter') filter: ContentItemFilterDto,
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
  ) {
    try {
      return await this.contentItemService.findWithFilters(filter, page, limit);
    } catch (error) {
      this.logger.error(
        `Failed to fetch filtered contentItems: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Query(() => ContentItem, { name: 'contentItem' })
  async findOne(@Args('id', { type: () => String }) id: string) {
    try {
      return await this.contentItemService.findOne(id);
    } catch (error) {
      this.logger.error(
        `Failed to fetch contentItem with id ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Query(() => [ContentItem], { name: 'searchContentItems' })
  async searchContentItems(
    @Args('searchTerm', { type: () => String }) searchTerm: string,
  ) {
    try {
      return await this.contentItemService.searchContentItems(searchTerm);
    } catch (error) {
      this.logger.error(
        `Failed to search contentItems with term '${searchTerm}': ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  // @Query(() => Object, { name: 'contentItemStatistics' })
  // @UseGuards(GqlAuthGuard, RolesGuard)
  // @Roles('ADMIN', 'INSTRUCTOR')
  // async getContentItemStatistics() {
  //   try {
  //     return await this.contentItemService.getContentItemStatistics();
  //   } catch (error) {
  //     this.logger.error(
  //       `Failed to get contentItem statistics: ${error.message}`,
  //       error.stack,
  //     );
  //     throw error;
  //   }
  // }

  @Mutation(() => ContentItem)
  @UseGuards(GqlAuthGuard)
  async updateContentItem(
    @Args('updateContentItemInput')
    updateContentItemInput: UpdateContentItemInput,
    @CurrentUser() user: User,
  ) {
    try {
      const contentItem = await this.contentItemService.update(
        updateContentItemInput.id,
        updateContentItemInput,
      );
      this.pubSub.publish('contentItemUpdated', {
        contentItemUpdated: contentItem,
      });
      return contentItem;
    } catch (error) {
      this.logger.error(
        `Failed to update contentItem: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Mutation(() => [ContentItem])
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN', 'INSTRUCTOR')
  async createManyContentItems(
    @Args('createContentItemInputs', { type: () => [CreateContentItemInput] })
    createContentItemInputs: CreateContentItemInput[],
    @CurrentUser() user: User,
  ) {
    try {
      const contentItemsWithCreator = createContentItemInputs.map((input) => ({
        ...input,
        createdBy: user._id,
      }));
      return await this.contentItemService.createMany(contentItemsWithCreator);
    } catch (error) {
      this.logger.error(
        `Failed to create multiple contentItems: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Mutation(() => Int)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN', 'INSTRUCTOR')
  async updateManyContentItems(
    @Args('updates', { type: () => [UpdateBulkContentItemInput] })
    updates: { id: string; data: Partial<UpdateContentItemInput> }[],
  ) {
    try {
      return await this.contentItemService.updateMany(updates);
    } catch (error) {
      this.logger.error(
        `Failed to update multiple contentItems: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Mutation(() => ContentItem)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async removeContentItem(@Args('id', { type: () => String }) id: string) {
    try {
      const contentItem = await this.contentItemService.remove(id);
      this.pubSub.publish('contentItemDeleted', {
        contentItemDeleted: contentItem,
      });
      return contentItem;
    } catch (error) {
      this.logger.error(
        `Failed to remove contentItem with id ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async bulkDeleteContentItems(
    @Args('ids', { type: () => [String] }) ids: string[],
  ) {
    try {
      const result = await this.contentItemService.bulkDelete(ids);
      return result;
    } catch (error) {
      this.logger.error(
        `Failed to bulk delete contentItems: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Query(() => [ContentItem], { name: 'popularContentItems' })
  async getPopularContentItems(
    @Args('limit', { type: () => Int, defaultValue: 5 }) limit: number,
  ) {
    try {
      return await this.contentItemService.getPopularContentItems(limit);
    } catch (error) {
      this.logger.error(
        `Failed to fetch popular contentItems: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Query(() => [ContentItem], { name: 'recentContentItems' })
  async getRecentContentItems(
    @Args('limit', { type: () => Int, defaultValue: 5 }) limit: number,
  ) {
    try {
      return await this.contentItemService.getRecentContentItems(limit);
    } catch (error) {
      this.logger.error(
        `Failed to fetch recent contentItems: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * RESOLVER FIELDS
   */

  @ResolveField()
  async creator(@Parent() contentItem: ContentItem) {
    try {
      const { createdBy } = contentItem;
      if (!createdBy) return null;
      // Assuming you have a user service to fetch user details
      // return await this.userService.findOne(createdBy);
      return null; // Replace with actual implementation
    } catch (error) {
      this.logger.error(
        `Failed to resolve creator for contentItem: ${error.message}`,
        error.stack,
      );
      return null;
    }
  }

  /**
   * Subscriptions
   * for real time updates
   */
  @Subscription(() => ContentItem)
  contentItemCreated() {
    return this.pubSub.asyncIterableIterator('contentItemCreated');
  }

  @Subscription(() => ContentItem)
  contentItemUpdated() {
    return this.pubSub.asyncIterableIterator('contentItemUpdated');
  }

  @Subscription(() => ContentItem)
  contentItemDeleted() {
    return this.pubSub.asyncIterableIterator('contentItemDeleted');
  }
}
