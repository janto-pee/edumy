import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateContentItemInput } from './dto/create-contentitem.input';
import { UpdateContentItemInput } from './dto/update-contentitem.input';
import { ContentItem } from './entities/contentitem.entity';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { RootFilterQuery } from 'mongoose';
import { ContentItemFilterDto } from './dto/filter-contentitem';
import { PaginationResponse } from 'src/common/pagination/pagination-response';

@Injectable()
export class ContentItemService {
  private readonly logger = new Logger(ContentItemService.name);

  constructor(
    @InjectModel(ContentItem.name) private contentItemModel: Model<ContentItem>,
  ) {}

  /**
   * Creates a new contentItem
   * @param createContentItemDto - The contentItem data to create
   * @returns The created contentItem
   */
  async create(
    createContentItemDto: CreateContentItemInput,
  ): Promise<ContentItem> {
    try {
      this.logger.log(
        `Creating new contentItem: ${createContentItemDto.title || 'Untitled'}`,
      );
      const createdContentItem =
        await this.contentItemModel.create(createContentItemDto);
      return createdContentItem;
    } catch (error: any) {
      this.logger.error(
        `Failed to create contentItem: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to create contentItem: ${error.message}`,
      );
    }
  }

  /**
   * Retrieves all contentItems with optional pagination
   * @param skip - Number of records to skip
   * @param limit - Maximum number of records to return
   * @returns Array of contentItems
   */
  async findAll(
    // query?: RootFilterQuery<ContentItem>,
    skip = 0,
    limit = 10,
  ): Promise<ContentItem[]> {
    try {
      this.logger.log(
        `Retrieving all contentItems with skip=${skip}, limit=${limit}`,
      );
      return await this.contentItemModel
        .find()
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec();
    } catch (error) {
      this.logger.error(
        `Failed to retrieve contentItems: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to retrieve contentItems: ${error.message}`,
      );
    }
  }

  /**
   * Finds contentItems with advanced filtering
   * @param filterDto - Filter criteria
   * @param page - Current page number
   * @param limit - Maximum number of records per page
   * @returns Filtered and paginated contentItems
   */
  async findWithFilters(
    filterDto: ContentItemFilterDto,
    page = 1,
    limit = 10,
  ): Promise<PaginationResponse<ContentItem>> {
    try {
      const skip = (page - 1) * limit;
      const query: any = {};

      if (filterDto.title) {
        query.title = { $regex: filterDto.title, $options: 'i' };
      }

      if (filterDto.category) {
        query.category = filterDto.category;
      }

      if (
        filterDto.minPrice !== undefined ||
        filterDto.maxPrice !== undefined
      ) {
        query.price = {};
        if (filterDto.minPrice !== undefined) {
          query.price.$gte = filterDto.minPrice;
        }
        if (filterDto.maxPrice !== undefined) {
          query.price.$lte = filterDto.maxPrice;
        }
      }

      const sortOptions: any = {};
      if (filterDto.sortBy) {
        sortOptions[filterDto.sortBy] =
          filterDto.sortDirection === 'desc' ? -1 : 1;
      } else {
        sortOptions.createdAt = -1;
      }

      const [contentItems, total] = await Promise.all([
        this.contentItemModel
          .find(query)
          .skip(skip)
          .limit(limit)
          .sort(sortOptions)
          .exec(),
        this.contentItemModel.countDocuments(query),
      ]);

      return {
        items: contentItems,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      this.logger.error(
        `Failed to filter contentItems: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to filter contentItems: ${error.message}`,
      );
    }
  }
  /**
   * Gets contentItem statistics
   * @returns Statistics about contentItems
   */
  async getContentItemStatistics(): Promise<any> {
    try {
      this.logger.log('Retrieving contentItem statistics');

      const [totalContentItems, categoryCounts, avgRating] = await Promise.all([
        this.countContentItems(),
        this.contentItemModel.aggregate([
          { $group: { _id: '$category', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ]),
        this.contentItemModel
          .aggregate([
            { $match: { rating: { $exists: true, $ne: null } } },
            { $group: { _id: null, avgRating: { $avg: '$rating' } } },
          ])
          .then((result) => result[0]?.avgRating || 0),
      ]);

      return {
        totalContentItems,
        categoryCounts,
        avgRating,
      };
    } catch (error) {
      this.logger.error(
        `Failed to get contentItem statistics: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to get contentItem statistics: ${error.message}`,
      );
    }
  }

  /**
   * Finds a contentItem by ID
   * @param id - The contentItem ID
   * @returns The found contentItem or null
   */
  async findOne(id: string): Promise<ContentItem> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException(`Invalid contentItem ID format: ${id}`);
      }

      this.logger.log(`Finding contentItem by ID: ${id}`);
      const contentItem = await this.contentItemModel.findById(id);

      if (!contentItem) {
        throw new NotFoundException(`ContentItem with ID ${id} not found`);
      }

      return contentItem;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      this.logger.error(
        `Failed to find contentItem: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to find contentItem: ${error.message}`,
      );
    }
  }

  /**
   * Gets the most popular contentItems based on enrollment count
   * @param limit - Maximum number of contentItems to return
   * @returns Array of popular contentItems
   */
  async getPopularContentItems(limit = 5): Promise<ContentItem[]> {
    try {
      this.logger.log(`Retrieving ${limit} popular contentItems`);

      // Find contentItems that are published, sort by enrollment count in descending order
      const popularContentItems = await this.contentItemModel
        .find({ isPublished: true })
        .sort({ enrollmentCount: -1, rating: -1 })
        .limit(limit)
        .exec();

      if (popularContentItems.length === 0) {
        this.logger.warn('No popular contentItems found');
      }

      return popularContentItems;
    } catch (error) {
      this.logger.error(
        `Failed to retrieve popular contentItems: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to retrieve popular contentItems: ${error.message}`,
      );
    }
  }

  /**
   * Gets the most recently created contentItems
   * @param limit - Maximum number of contentItems to return
   * @returns Array of recent contentItems
   */
  async getRecentContentItems(limit = 5): Promise<ContentItem[]> {
    try {
      this.logger.log(`Retrieving ${limit} recent contentItems`);

      // Find contentItems that are published, sort by creation date in descending order
      const recentContentItems = await this.contentItemModel
        .find({ isPublished: true })
        .sort({ createdAt: -1 })
        .limit(limit)
        .exec();

      if (recentContentItems.length === 0) {
        this.logger.warn('No recent contentItems found');
      }

      return recentContentItems;
    } catch (error) {
      this.logger.error(
        `Failed to retrieve recent contentItems: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to retrieve recent contentItems: ${error.message}`,
      );
    }
  }

  /**
   * Finds contentItems by program ID
   * @param id - The program ID
   * @returns Array of contentItems in the program
   */
  async findContentItemByProgram(id: string): Promise<ContentItem[]> {
    try {
      this.logger.log(`Finding contentItems by program ID: ${id}`);
      const contentItems = await this.contentItemModel.find({ program: id });

      if (!contentItems || contentItems.length === 0) {
        this.logger.warn(`No contentItems found for program ID: ${id}`);
      }

      return contentItems;
    } catch (error) {
      this.logger.error(
        `Failed to find contentItems by program: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to find contentItems by program: ${error.message}`,
      );
    }
  }

  /**
   * Updates a contentItem
   * @param id - The contentItem ID
   * @param updateContentItemInput - The updated contentItem data
   * @returns The updated contentItem
   */
  async update(
    id: string,
    updateContentItemInput: UpdateContentItemInput,
  ): Promise<ContentItem> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException(`Invalid contentItem ID format: ${id}`);
      }

      this.logger.log(`Updating contentItem with ID: ${id}`);
      const updatedContentItem = await this.contentItemModel.findByIdAndUpdate(
        id,
        updateContentItemInput,
        { new: true, runValidators: true },
      );

      if (!updatedContentItem) {
        throw new NotFoundException(`ContentItem with ID ${id} not found`);
      }

      return updatedContentItem;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      this.logger.error(
        `Failed to update contentItem: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to update contentItem: ${error.message}`,
      );
    }
  }

  /**
   * Removes a contentItem
   * @param id - The contentItem ID
   * @returns The removed contentItem
   */
  async remove(id: string): Promise<ContentItem> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException(`Invalid contentItem ID format: ${id}`);
      }

      this.logger.log(`Removing contentItem with ID: ${id}`);
      const deletedContentItem =
        await this.contentItemModel.findByIdAndDelete(id);

      if (!deletedContentItem) {
        throw new NotFoundException(`ContentItem with ID ${id} not found`);
      }

      return deletedContentItem;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      this.logger.error(
        `Failed to remove contentItem: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to remove contentItem: ${error.message}`,
      );
    }
  }

  /**
   * Searches contentItems by title or description
   * @param searchTerm - The search term
   * @returns Matching contentItems
   */
  async searchContentItems(searchTerm: string): Promise<ContentItem[]> {
    try {
      this.logger.log(`Searching contentItems with term: ${searchTerm}`);
      return await this.contentItemModel
        .find({
          $or: [
            { title: { $regex: searchTerm, $options: 'i' } },
            { description: { $regex: searchTerm, $options: 'i' } },
          ],
        })
        .exec();
    } catch (error) {
      this.logger.error(
        `Failed to search contentItems: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to search contentItems: ${error.message}`,
      );
    }
  }

  /**
   * Counts total contentItems
   * @returns Total number of contentItems
   */
  async countContentItems(
    query?: RootFilterQuery<ContentItem>,
  ): Promise<number> {
    try {
      return await this.contentItemModel.countDocuments(query);
    } catch (error) {
      this.logger.error(
        `Failed to count contentItems: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to count contentItems: ${error.message}`,
      );
    }
  }

  /**
   * Finds contentItems by multiple IDs
   * @param ids - Array of contentItem IDs
   * @returns Array of found contentItems
   */
  async findByIds(ids: string[]): Promise<ContentItem[]> {
    try {
      const validIds = ids.filter((id) => Types.ObjectId.isValid(id));
      if (validIds.length !== ids.length) {
        this.logger.warn(
          'Some provided contentItem IDs were invalid and will be ignored',
        );
      }

      return await this.contentItemModel
        .find({
          _id: { $in: validIds.map((id) => new Types.ObjectId(id)) },
        })
        .exec();
    } catch (error) {
      this.logger.error(
        `Failed to find contentItems by IDs: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to find contentItems by IDs: ${error.message}`,
      );
    }
  }

  /**
   * Creates multiple contentItems at once
   * @param createContentItemDtos - Array of contentItem data to create
   * @returns The created contentItems
   */
  async createMany(
    createContentItemDtos: CreateContentItemInput[],
  ): Promise<ContentItem[]> {
    try {
      this.logger.log(
        `Creating ${createContentItemDtos.length} new contentItems`,
      );
      return await this.contentItemModel.insertMany(createContentItemDtos, {
        ordered: false,
      });
    } catch (error) {
      this.logger.error(
        `Failed to create contentItems in bulk: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to create contentItems in bulk: ${error.message}`,
      );
    }
  }

  /**
   * Updates multiple contentItems by their IDs
   * @param updates - Array of {id, data} objects
   * @returns Number of updated documents
   */
  async updateMany(
    updates: { id: string; data: Partial<UpdateContentItemInput> }[],
  ): Promise<number> {
    try {
      this.logger.log(`Updating ${updates.length} contentItems`);

      const operations = updates.map((update) => ({
        updateOne: {
          filter: { _id: new Types.ObjectId(update.id) },
          update: { $set: update.data },
        },
      }));

      const result = await this.contentItemModel.bulkWrite(operations);
      return result.modifiedCount;
    } catch (error) {
      this.logger.error(
        `Failed to update contentItems in bulk: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to update contentItems in bulk: ${error.message}`,
      );
    }
  }

  /**
   * Deletes multiple contentItems by their IDs
   * @param ids - Array of contentItem IDs to delete
   * @returns Boolean indicating success
   */
  async bulkDelete(ids: string[]): Promise<boolean> {
    try {
      // Filter out invalid IDs
      const validIds = ids.filter((id) => Types.ObjectId.isValid(id));

      if (validIds.length === 0) {
        this.logger.warn('No valid contentItem IDs provided for bulk deletion');
        return false;
      }

      if (validIds.length !== ids.length) {
        this.logger.warn(
          `${ids.length - validIds.length} invalid contentItem IDs were provided and will be ignored`,
        );
      }

      this.logger.log(`Bulk deleting ${validIds.length} contentItems`);

      const result = await this.contentItemModel.deleteMany({
        _id: { $in: validIds.map((id) => new Types.ObjectId(id)) },
      });

      this.logger.log(
        `Successfully deleted ${result.deletedCount} contentItems`,
      );

      // Return true if at least one document was deleted
      return result.deletedCount > 0;
    } catch (error) {
      this.logger.error(
        `Failed to bulk delete contentItems: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to bulk delete contentItems: ${error.message}`,
      );
    }
  }
}
