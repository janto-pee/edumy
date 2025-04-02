import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateCourseMetaDatumInput } from './dto/create-coursemetadatum.input';
import { UpdateCourseMetaDatumInput } from './dto/update-coursemetadatum.input';
import { CourseMetaDatum } from './entities/coursemetadatum.entity';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { RootFilterQuery } from 'mongoose';
import { CourseMetaDatumFilterDto } from './dto/filter-coursemetadatum';
import { PaginationResponse } from 'src/common/pagination/pagination-response';

@Injectable()
export class CourseMetaDatumService {
  private readonly logger = new Logger(CourseMetaDatumService.name);

  constructor(
    @InjectModel(CourseMetaDatum.name)
    private courseModel: Model<CourseMetaDatum>,
  ) {}

  /**
   * Creates a new course
   * @param createCourseMetaDatumDto - The course data to create
   * @returns The created course
   */
  async create(
    createCourseMetaDatumDto: CreateCourseMetaDatumInput,
  ): Promise<CourseMetaDatum> {
    try {
      this.logger.log(
        `Creating new course: ${createCourseMetaDatumDto.title || 'Untitled'}`,
      );
      const createdCourseMetaDatum = await this.courseModel.create(
        createCourseMetaDatumDto,
      );
      return createdCourseMetaDatum;
    } catch (error: any) {
      this.logger.error(
        `Failed to create course: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to create course: ${error.message}`,
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
    // query?: RootFilterQuery<CourseMetaDatum>,
    skip = 0,
    limit = 10,
  ): Promise<CourseMetaDatum[]> {
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
    filterDto: CourseMetaDatumFilterDto,
    page = 1,
    limit = 10,
  ): Promise<PaginationResponse<CourseMetaDatum>> {
    try {
      const skip = (page - 1) * limit;
      const query: any = {};

      if (filterDto.title) {
        query.title = { $regex: filterDto.title, $options: 'i' };
      }

      if (filterDto.contentType) {
        query.contentType = filterDto.contentType;
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
   * Gets course statistics
   * @returns Statistics about courses
   */
  async getCourseMetaDatumStatistics(): Promise<any> {
    try {
      this.logger.log('Retrieving course statistics');

      const [totalCourseMetaDatums, categoryCounts, avgRating] =
        await Promise.all([
          this.countCourseMetaDatums(),
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
        totalCourseMetaDatums,
        categoryCounts,
        avgRating,
      };
    } catch (error) {
      this.logger.error(
        `Failed to get course statistics: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to get course statistics: ${error.message}`,
      );
    }
  }

  /**
   * Finds a course by ID
   * @param id - The course ID
   * @returns The found course or null
   */
  async findOne(id: string): Promise<CourseMetaDatum> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException(`Invalid course ID format: ${id}`);
      }

      this.logger.log(`Finding course by ID: ${id}`);
      const course = await this.courseModel.findById(id);

      if (!course) {
        throw new NotFoundException(`CourseMetaDatum with ID ${id} not found`);
      }

      return course;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      this.logger.error(`Failed to find course: ${error.message}`, error.stack);
      throw new BadRequestException(`Failed to find course: ${error.message}`);
    }
  }

  /**
   * Gets the most popular courses based on enrollment count
   * @param limit - Maximum number of courses to return
   * @returns Array of popular courses
   */
  async getPopularCourseMetaDatums(limit = 5): Promise<CourseMetaDatum[]> {
    try {
      this.logger.log(`Retrieving ${limit} popular courses`);

      // Find courses that are published, sort by enrollment count in descending order
      const popularCourseMetaDatums = await this.courseModel
        .find({ isPublished: true })
        .sort({ enrollmentCount: -1, rating: -1 })
        .limit(limit)
        .exec();

      if (popularCourseMetaDatums.length === 0) {
        this.logger.warn('No popular courses found');
      }

      return popularCourseMetaDatums;
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
  async getRecentCourseMetaDatums(limit = 5): Promise<CourseMetaDatum[]> {
    try {
      this.logger.log(`Retrieving ${limit} recent courses`);

      // Find courses that are published, sort by creation date in descending order
      const recentCourseMetaDatums = await this.courseModel
        .find({ isPublished: true })
        .sort({ createdAt: -1 })
        .limit(limit)
        .exec();

      if (recentCourseMetaDatums.length === 0) {
        this.logger.warn('No recent courses found');
      }

      return recentCourseMetaDatums;
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
  async findCourseMetaDatumByProgram(id: string): Promise<CourseMetaDatum[]> {
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
   * Updates a course
   * @param id - The course ID
   * @param UpdateCourseMetaDatumInput - The updated course data
   * @returns The updated course
   */
  async update(
    id: string,
    UpdateCourseMetaDatumInput: UpdateCourseMetaDatumInput,
  ): Promise<CourseMetaDatum> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException(`Invalid course ID format: ${id}`);
      }

      this.logger.log(`Updating course with ID: ${id}`);
      const updatedCourseMetaDatum = await this.courseModel.findByIdAndUpdate(
        id,
        UpdateCourseMetaDatumInput,
        { new: true, runValidators: true },
      );

      if (!updatedCourseMetaDatum) {
        throw new NotFoundException(`CourseMetaDatum with ID ${id} not found`);
      }

      return updatedCourseMetaDatum;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      this.logger.error(
        `Failed to update course: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to update course: ${error.message}`,
      );
    }
  }

  /**
   * Removes a course
   * @param id - The course ID
   * @returns The removed course
   */
  async remove(id: string): Promise<CourseMetaDatum> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException(`Invalid course ID format: ${id}`);
      }

      this.logger.log(`Removing course with ID: ${id}`);
      const deletedCourseMetaDatum =
        await this.courseModel.findByIdAndDelete(id);

      if (!deletedCourseMetaDatum) {
        throw new NotFoundException(`CourseMetaDatum with ID ${id} not found`);
      }

      return deletedCourseMetaDatum;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      this.logger.error(
        `Failed to remove course: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to remove course: ${error.message}`,
      );
    }
  }

  /**
   * Searches courses by title or description
   * @param searchTerm - The search term
   * @returns Matching courses
   */
  async searchCourseMetaDatums(searchTerm: string): Promise<CourseMetaDatum[]> {
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
  async countCourseMetaDatums(
    query?: RootFilterQuery<CourseMetaDatum>,
  ): Promise<number> {
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
   * @param ids - Array of course IDs
   * @returns Array of found courses
   */
  async findByIds(ids: string[]): Promise<CourseMetaDatum[]> {
    try {
      const validIds = ids.filter((id) => Types.ObjectId.isValid(id));
      if (validIds.length !== ids.length) {
        this.logger.warn(
          'Some provided course IDs were invalid and will be ignored',
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
   * @param createCourseMetaDatumDtos - Array of course data to create
   * @returns The created courses
   */
  async createMany(
    createCourseMetaDatumDtos: CreateCourseMetaDatumInput[],
  ): Promise<CourseMetaDatum[]> {
    try {
      this.logger.log(
        `Creating ${createCourseMetaDatumDtos.length} new courses`,
      );
      return await this.courseModel.insertMany(createCourseMetaDatumDtos, {
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
    updates: { id: string; data: Partial<UpdateCourseMetaDatumInput> }[],
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
   * @param ids - Array of course IDs to delete
   * @returns Boolean indicating success
   */
  async bulkDelete(ids: string[]): Promise<boolean> {
    try {
      // Filter out invalid IDs
      const validIds = ids.filter((id) => Types.ObjectId.isValid(id));

      if (validIds.length === 0) {
        this.logger.warn('No valid course IDs provided for bulk deletion');
        return false;
      }

      if (validIds.length !== ids.length) {
        this.logger.warn(
          `${ids.length - validIds.length} invalid course IDs were provided and will be ignored`,
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
