import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateCourseInput } from './dto/create-course.input';
import { UpdateCourseInput } from './dto/update-course.input';
import { Course } from './entities/course.entity';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { RootFilterQuery } from 'mongoose';
import { CourseFilterDto } from './dto/filter-course';
import { PaginationResponse } from 'src/common/pagination/pagination-response';

@Injectable()
export class CourseService {
  private readonly logger = new Logger(CourseService.name);

  constructor(@InjectModel(Course.name) private courseModel: Model<Course>) {}

  /**
   * Creates a new course
   * @param createCourseDto - The course data to create
   * @returns The created course
   */
  async create(createCourseDto: CreateCourseInput): Promise<Course> {
    try {
      this.logger.log(
        `Creating new course: ${createCourseDto.title || 'Untitled'}`,
      );
      const createdCourse = await this.courseModel.create(createCourseDto);
      return createdCourse;
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
    // query?: RootFilterQuery<Course>,
    skip = 0,
    limit = 10,
  ): Promise<Course[]> {
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
    filterDto: CourseFilterDto,
    page = 1,
    limit = 10,
  ): Promise<PaginationResponse<Course>> {
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
  async getCourseStatistics(): Promise<any> {
    try {
      this.logger.log('Retrieving course statistics');

      const [totalCourses, categoryCounts, avgRating] = await Promise.all([
        this.countCourses(),
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
        totalCourses,
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
  async findOne(id: string): Promise<Course> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException(`Invalid course ID format: ${id}`);
      }

      this.logger.log(`Finding course by ID: ${id}`);
      const course = await this.courseModel.findById(id);

      if (!course) {
        throw new NotFoundException(`Course with ID ${id} not found`);
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
  async getPopularCourses(limit = 5): Promise<Course[]> {
    try {
      this.logger.log(`Retrieving ${limit} popular courses`);

      // Find courses that are published, sort by enrollment count in descending order
      const popularCourses = await this.courseModel
        .find({ isPublished: true })
        .sort({ enrollmentCount: -1, rating: -1 })
        .limit(limit)
        .exec();

      if (popularCourses.length === 0) {
        this.logger.warn('No popular courses found');
      }

      return popularCourses;
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
  async getRecentCourses(limit = 5): Promise<Course[]> {
    try {
      this.logger.log(`Retrieving ${limit} recent courses`);

      // Find courses that are published, sort by creation date in descending order
      const recentCourses = await this.courseModel
        .find({ isPublished: true })
        .sort({ createdAt: -1 })
        .limit(limit)
        .exec();

      if (recentCourses.length === 0) {
        this.logger.warn('No recent courses found');
      }

      return recentCourses;
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
  async findCourseByProgram(id: string): Promise<Course[]> {
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
   * @param updateCourseInput - The updated course data
   * @returns The updated course
   */
  async update(
    id: string,
    updateCourseInput: UpdateCourseInput,
  ): Promise<Course> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException(`Invalid course ID format: ${id}`);
      }

      this.logger.log(`Updating course with ID: ${id}`);
      const updatedCourse = await this.courseModel.findByIdAndUpdate(
        id,
        updateCourseInput,
        { new: true, runValidators: true },
      );

      if (!updatedCourse) {
        throw new NotFoundException(`Course with ID ${id} not found`);
      }

      return updatedCourse;
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
  async remove(id: string): Promise<Course> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException(`Invalid course ID format: ${id}`);
      }

      this.logger.log(`Removing course with ID: ${id}`);
      const deletedCourse = await this.courseModel.findByIdAndDelete(id);

      if (!deletedCourse) {
        throw new NotFoundException(`Course with ID ${id} not found`);
      }

      return deletedCourse;
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
  async searchCourses(searchTerm: string): Promise<Course[]> {
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
  async countCourses(query?: RootFilterQuery<Course>): Promise<number> {
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
  async findByIds(ids: string[]): Promise<Course[]> {
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
   * @param createCourseDtos - Array of course data to create
   * @returns The created courses
   */
  async createMany(createCourseDtos: CreateCourseInput[]): Promise<Course[]> {
    try {
      this.logger.log(`Creating ${createCourseDtos.length} new courses`);
      return await this.courseModel.insertMany(createCourseDtos, {
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
    updates: { id: string; data: Partial<UpdateCourseInput> }[],
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
