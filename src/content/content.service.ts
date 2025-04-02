import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateContentInput } from './dto/create-content.input';
import { UpdateContentInput } from './dto/update-content.input';
import { Content } from './entities/content.entity';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { RootFilterQuery } from 'mongoose';
import { ContentFilterDto } from './dto/filter-content';
import { PaginationResponse } from 'src/common/pagination/pagination-response';

@Injectable()
export class ContentService {
  private readonly logger = new Logger(ContentService.name);

  constructor(@InjectModel(Content.name) private courseModel: Model<Content>) {}

  /**
   * Creates a new content
   * @param createContentDto - The content data to create
   * @returns The created content
   */
  async create(createContentDto: CreateContentInput): Promise<Content> {
    try {
      this.logger.log(
        `Creating new content: ${createContentDto.title || 'Untitled'}`,
      );
      const createdContent = await this.courseModel.create(createContentDto);
      return createdContent;
    } catch (error: any) {
      this.logger.error(
        `Failed to create content: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to create content: ${error.message}`,
      );
    }
  }

  /**
   * Retrieves all courses with optional pagination
   * @param skip - Number of records to skip
   * @param limit - Maximum number of records to return
   * @returns Array of courses
   */
  async findAll(
    // query?: RootFilterQuery<Content>,
    skip = 0,
    limit = 10,
  ): Promise<Content[]> {
    try {
      this.logger.log(
        `Retrieving all courses with skip=${skip}, limit=${limit}`,
      );
      return await this.courseModel
        .find()
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec();
    } catch (error) {
      this.logger.error(
        `Failed to retrieve courses: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to retrieve courses: ${error.message}`,
      );
    }
  }

  /**
   * Finds courses with advanced filtering
   * @param filterDto - Filter criteria
   * @param page - Current page number
   * @param limit - Maximum number of records per page
   * @returns Filtered and paginated courses
   */
  async findWithFilters(
    filterDto: ContentFilterDto,
    page = 1,
    limit = 10,
  ): Promise<PaginationResponse<Content>> {
    try {
      const skip = (page - 1) * limit;
      const query: any = {};

      if (filterDto.title) {
        query.title = { $regex: filterDto.title, $options: 'i' };
      }

      const sortOptions: any = {};
      if (filterDto.sortBy) {
        sortOptions[filterDto.sortBy] =
          filterDto.sortDirection === 'desc' ? -1 : 1;
      } else {
        sortOptions.createdAt = -1;
      }

      const [courses, total] = await Promise.all([
        this.courseModel
          .find(query)
          .skip(skip)
          .limit(limit)
          .sort(sortOptions)
          .exec(),
        this.courseModel.countDocuments(query),
      ]);

      return {
        items: courses,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      this.logger.error(
        `Failed to filter courses: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to filter courses: ${error.message}`,
      );
    }
  }
  /**
   * Gets content statistics
   * @returns Statistics about courses
   */
  async getContentStatistics(): Promise<any> {
    try {
      this.logger.log('Retrieving content statistics');

      const [totalContents, categoryCounts, avgRating] = await Promise.all([
        this.countContents(),
        this.courseModel.aggregate([
          { $group: { _id: '$category', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ]),
        this.courseModel
          .aggregate([
            { $match: { rating: { $exists: true, $ne: null } } },
            { $group: { _id: null, avgRating: { $avg: '$rating' } } },
          ])
          .then((result) => result[0]?.avgRating || 0),
      ]);

      return {
        totalContents,
        categoryCounts,
        avgRating,
      };
    } catch (error) {
      this.logger.error(
        `Failed to get content statistics: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to get content statistics: ${error.message}`,
      );
    }
  }

  /**
   * Finds a content by ID
   * @param id - The content ID
   * @returns The found content or null
   */
  async findOne(id: string): Promise<Content> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException(`Invalid content ID format: ${id}`);
      }

      this.logger.log(`Finding content by ID: ${id}`);
      const content = await this.courseModel.findById(id);

      if (!content) {
        throw new NotFoundException(`Content with ID ${id} not found`);
      }

      return content;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      this.logger.error(
        `Failed to find content: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(`Failed to find content: ${error.message}`);
    }
  }

  /**
   * Gets the most popular courses based on enrollment count
   * @param limit - Maximum number of courses to return
   * @returns Array of popular courses
   */
  async getPopularContents(limit = 5): Promise<Content[]> {
    try {
      this.logger.log(`Retrieving ${limit} popular courses`);

      // Find courses that are published, sort by enrollment count in descending order
      const popularContents = await this.courseModel
        .find({ isPublished: true })
        .sort({ enrollmentCount: -1, rating: -1 })
        .limit(limit)
        .exec();

      if (popularContents.length === 0) {
        this.logger.warn('No popular courses found');
      }

      return popularContents;
    } catch (error) {
      this.logger.error(
        `Failed to retrieve popular courses: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to retrieve popular courses: ${error.message}`,
      );
    }
  }

  /**
   * Gets the most recently created courses
   * @param limit - Maximum number of courses to return
   * @returns Array of recent courses
   */
  async getRecentContents(limit = 5): Promise<Content[]> {
    try {
      this.logger.log(`Retrieving ${limit} recent courses`);

      // Find courses that are published, sort by creation date in descending order
      const recentContents = await this.courseModel
        .find({ isPublished: true })
        .sort({ createdAt: -1 })
        .limit(limit)
        .exec();

      if (recentContents.length === 0) {
        this.logger.warn('No recent courses found');
      }

      return recentContents;
    } catch (error) {
      this.logger.error(
        `Failed to retrieve recent courses: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to retrieve recent courses: ${error.message}`,
      );
    }
  }

  /**
   * Finds courses by program ID
   * @param id - The program ID
   * @returns Array of courses in the program
   */
  async findContentByProgram(id: string): Promise<Content[]> {
    try {
      this.logger.log(`Finding courses by program ID: ${id}`);
      const courses = await this.courseModel.find({ program: id });

      if (!courses || courses.length === 0) {
        this.logger.warn(`No courses found for program ID: ${id}`);
      }

      return courses;
    } catch (error) {
      this.logger.error(
        `Failed to find courses by program: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to find courses by program: ${error.message}`,
      );
    }
  }

  /**
   * Updates a content
   * @param id - The content ID
   * @param UpdateContentInput - The updated content data
   * @returns The updated content
   */
  async update(
    id: string,
    UpdateContentInput: UpdateContentInput,
  ): Promise<Content> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException(`Invalid content ID format: ${id}`);
      }

      this.logger.log(`Updating content with ID: ${id}`);
      const updatedContent = await this.courseModel.findByIdAndUpdate(
        id,
        UpdateContentInput,
        { new: true, runValidators: true },
      );

      if (!updatedContent) {
        throw new NotFoundException(`Content with ID ${id} not found`);
      }

      return updatedContent;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      this.logger.error(
        `Failed to update content: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to update content: ${error.message}`,
      );
    }
  }

  /**
   * Removes a content
   * @param id - The content ID
   * @returns The removed content
   */
  async remove(id: string): Promise<Content> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException(`Invalid content ID format: ${id}`);
      }

      this.logger.log(`Removing content with ID: ${id}`);
      const deletedContent = await this.courseModel.findByIdAndDelete(id);

      if (!deletedContent) {
        throw new NotFoundException(`Content with ID ${id} not found`);
      }

      return deletedContent;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      this.logger.error(
        `Failed to remove content: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to remove content: ${error.message}`,
      );
    }
  }

  /**
   * Searches courses by title or description
   * @param searchTerm - The search term
   * @returns Matching courses
   */
  async searchContents(searchTerm: string): Promise<Content[]> {
    try {
      this.logger.log(`Searching courses with term: ${searchTerm}`);
      return await this.courseModel
        .find({
          $or: [
            { title: { $regex: searchTerm, $options: 'i' } },
            { description: { $regex: searchTerm, $options: 'i' } },
          ],
        })
        .exec();
    } catch (error) {
      this.logger.error(
        `Failed to search courses: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to search courses: ${error.message}`,
      );
    }
  }

  /**
   * Counts total courses
   * @returns Total number of courses
   */
  async countContents(query?: RootFilterQuery<Content>): Promise<number> {
    try {
      return await this.courseModel.countDocuments(query);
    } catch (error) {
      this.logger.error(
        `Failed to count courses: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to count courses: ${error.message}`,
      );
    }
  }

  /**
   * Finds courses by multiple IDs
   * @param ids - Array of content IDs
   * @returns Array of found courses
   */
  async findByIds(ids: string[]): Promise<Content[]> {
    try {
      const validIds = ids.filter((id) => Types.ObjectId.isValid(id));
      if (validIds.length !== ids.length) {
        this.logger.warn(
          'Some provided content IDs were invalid and will be ignored',
        );
      }

      return await this.courseModel
        .find({
          _id: { $in: validIds.map((id) => new Types.ObjectId(id)) },
        })
        .exec();
    } catch (error) {
      this.logger.error(
        `Failed to find courses by IDs: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to find courses by IDs: ${error.message}`,
      );
    }
  }

  /**
   * Creates multiple courses at once
   * @param createContentDtos - Array of content data to create
   * @returns The created courses
   */
  async createMany(
    createContentDtos: CreateContentInput[],
  ): Promise<Content[]> {
    try {
      this.logger.log(`Creating ${createContentDtos.length} new courses`);
      return await this.courseModel.insertMany(createContentDtos, {
        ordered: false,
      });
    } catch (error) {
      this.logger.error(
        `Failed to create courses in bulk: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to create courses in bulk: ${error.message}`,
      );
    }
  }

  /**
   * Updates multiple courses by their IDs
   * @param updates - Array of {id, data} objects
   * @returns Number of updated documents
   */
  async updateMany(
    updates: { id: string; data: Partial<UpdateContentInput> }[],
  ): Promise<number> {
    try {
      this.logger.log(`Updating ${updates.length} courses`);

      const operations = updates.map((update) => ({
        updateOne: {
          filter: { _id: new Types.ObjectId(update.id) },
          update: { $set: update.data },
        },
      }));

      const result = await this.courseModel.bulkWrite(operations);
      return result.modifiedCount;
    } catch (error) {
      this.logger.error(
        `Failed to update courses in bulk: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to update courses in bulk: ${error.message}`,
      );
    }
  }

  /**
   * Deletes multiple courses by their IDs
   * @param ids - Array of content IDs to delete
   * @returns Boolean indicating success
   */
  async bulkDelete(ids: string[]): Promise<boolean> {
    try {
      // Filter out invalid IDs
      const validIds = ids.filter((id) => Types.ObjectId.isValid(id));

      if (validIds.length === 0) {
        this.logger.warn('No valid content IDs provided for bulk deletion');
        return false;
      }

      if (validIds.length !== ids.length) {
        this.logger.warn(
          `${ids.length - validIds.length} invalid content IDs were provided and will be ignored`,
        );
      }

      this.logger.log(`Bulk deleting ${validIds.length} courses`);

      const result = await this.courseModel.deleteMany({
        _id: { $in: validIds.map((id) => new Types.ObjectId(id)) },
      });

      this.logger.log(`Successfully deleted ${result.deletedCount} courses`);

      // Return true if at least one document was deleted
      return result.deletedCount > 0;
    } catch (error) {
      this.logger.error(
        `Failed to bulk delete courses: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to bulk delete courses: ${error.message}`,
      );
    }
  }
}
