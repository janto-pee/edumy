import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import { CreateCourseInput } from './dto/create-course.input';
import { UpdateCourseInput } from './dto/update-course.input';
import { Course } from './entities/course.entity';
import { Model, Types, PipelineStage } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { RootFilterQuery } from 'mongoose';
import { CourseFilterDto } from './dto/filter-course';
import { PaginationResponse } from 'src/common/pagination/pagination-response';
import { PubSub } from 'graphql-subscriptions';
import { InjectPubSub } from 'src/pubsub/pubsub.decorator';

@Injectable()
export class CourseService {
  private readonly logger = new Logger(CourseService.name);

  constructor(
    @InjectModel(Course.name) private courseModel: Model<Course>,
    @InjectPubSub() private readonly pubSub: PubSub,
  ) {}

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

      // Check if a course with the same title already exists
      const existingCourse = await this.courseModel
        .findOne({
          title: createCourseDto.title,
        })
        .lean();

      if (existingCourse) {
        throw new ConflictException(
          `Course with title "${createCourseDto.title}" already exists`,
        );
      }

      const createdCourse = await this.courseModel.create(createCourseDto);

      // Publish event for course creation
      await this.pubSub.publish('courseCreated', {
        courseCreated: createdCourse,
      });

      return createdCourse;
    } catch (error: any) {
      if (error instanceof ConflictException) {
        throw error;
      }

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
   * Retrieves all courses with optional pagination and caching
   * @param skip - Number of records to skip
   * @param limit - Maximum number of records to return
   * @param useCache - Whether to use cached results if available
   * @returns Array of courses
   */
  async findAll(skip = 0, limit = 10, useCache = true): Promise<Course[]> {
    try {
      this.logger.log(
        `Retrieving all courses with skip=${skip}, limit=${limit}, useCache=${useCache}`,
      );

      // Add caching key for frequently accessed data
      const cacheOptions = useCache ? { maxTimeMS: 30000 } : {};

      return await this.courseModel
        .find({}, {}, cacheOptions)
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

      // Enhanced search capabilities
      if (filterDto.title) {
        query.title = { $regex: filterDto.title, $options: 'i' };
      }

      if (filterDto.category) {
        if (Array.isArray(filterDto.category)) {
          query.category = { $in: filterDto.category };
        } else {
          query.category = filterDto.category;
        }
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

      // Add instructor filter
      if (filterDto.instructor) {
        query.instructor = filterDto.instructor;
      }

      // Add published status filter
      if (filterDto.isPublished !== undefined) {
        query.isPublished = filterDto.isPublished;
      }

      // Add rating filter
      if (filterDto.minRating !== undefined) {
        query.rating = { $gte: filterDto.minRating };
      }

      const sortOptions: any = {};
      if (filterDto.sortBy) {
        sortOptions[filterDto.sortBy] =
          filterDto.sortDirection === 'desc' ? -1 : 1;
      } else {
        sortOptions.createdAt = -1;
      }

      // Use Promise.all for parallel execution
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
        hasNextPage: page < Math.ceil(total / limit),
        hasPreviousPage: page > 1,
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
   * Gets comprehensive course statistics
   * @returns Statistics about courses
   */
  async getCourseStatistics(): Promise<any> {
    try {
      this.logger.log('Retrieving course statistics');

      const [
        totalCourses,
        categoryCounts,
        avgRating,
        priceStats,
        enrollmentStats,
        publishedVsUnpublished,
      ] = await Promise.all([
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
        // Add price statistics
        this.courseModel
          .aggregate([
            { $match: { price: { $exists: true, $ne: null } } },
            {
              $group: {
                _id: null,
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' },
              },
            },
          ])
          .then(
            (result) => result[0] || { avgPrice: 0, minPrice: 0, maxPrice: 0 },
          ),
        // Add enrollment statistics
        this.courseModel
          .aggregate([
            { $match: { enrollmentCount: { $exists: true } } },
            {
              $group: {
                _id: null,
                totalEnrollments: { $sum: '$enrollmentCount' },
                avgEnrollments: { $avg: '$enrollmentCount' },
                maxEnrollments: { $max: '$enrollmentCount' },
              },
            },
          ])
          .then(
            (result) =>
              result[0] || {
                totalEnrollments: 0,
                avgEnrollments: 0,
                maxEnrollments: 0,
              },
          ),
        // Published vs unpublished stats
        this.courseModel
          .aggregate([
            {
              $group: {
                _id: '$isPublished',
                count: { $sum: 1 },
              },
            },
          ])
          .then((results) => {
            const stats = { published: 0, unpublished: 0 };
            results.forEach((item) => {
              if (item._id === true) stats.published = item.count;
              else if (item._id === false) stats.unpublished = item.count;
            });
            return stats;
          }),
      ]);

      return {
        totalCourses,
        categoryCounts,
        avgRating,
        priceStats,
        enrollmentStats,
        publishedVsUnpublished,
        lastUpdated: new Date(),
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
   * Finds a course by ID with optional related content
   * @param id - The course ID
   * @param includeContent - Whether to include related content
   * @returns The found course or null
   */
  async findOne(id: string, includeContent = false): Promise<Course> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException(`Invalid course ID format: ${id}`);
      }

      this.logger.log(
        `Finding course by ID: ${id}, includeContent: ${includeContent}`,
      );

      let courseQuery = this.courseModel.findById(id);

      // Optionally populate related content
      if (includeContent) {
        courseQuery = courseQuery.populate('content');
      }

      const course = await courseQuery.exec();

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
   * Gets the most popular courses based on enrollment count and rating
   * @param limit - Maximum number of courses to return
   * @param minRating - Minimum rating threshold
   * @returns Array of popular courses
   */
  async getPopularCourses(limit = 5, minRating = 0): Promise<Course[]> {
    try {
      this.logger.log(
        `Retrieving ${limit} popular courses with minRating=${minRating}`,
      );

      // Find courses that are published, with minimum rating, sort by enrollment count
      const popularCourses = await this.courseModel
        .find({
          isPublished: true,
          rating: { $gte: minRating },
        })
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
   * Gets the most recently created courses with optional category filter
   * @param limit - Maximum number of courses to return
   * @param category - Optional category to filter by
   * @returns Array of recent courses
   */
  async getRecentCourses(limit = 5, category?: string): Promise<Course[]> {
    try {
      this.logger.log(
        `Retrieving ${limit} recent courses${category ? ` in category: ${category}` : ''}`,
      );

      // Build query
      const query: any = { isPublished: true };
      if (category) {
        query.category = category;
      }

      // Find courses that are published, sort by creation date
      const recentCourses = await this.courseModel
        .find(query)
        .sort({ createdAt: -1 })
        .limit(limit)
        .exec();

      if (recentCourses.length === 0) {
        this.logger.warn(
          `No recent courses found${category ? ` in category: ${category}` : ''}`,
        );
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
   * Finds courses by program ID with optional pagination
   * @param id - The program ID
   * @param skip - Number of records to skip
   * @param limit - Maximum number of records to return
   * @returns Array of courses in the program
   */
  async findCourseByProgram(
    id: string,
    skip = 0,
    limit = 10,
  ): Promise<Course[]> {
    try {
      this.logger.log(
        `Finding courses by program ID: ${id} with skip=${skip}, limit=${limit}`,
      );

      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException(`Invalid program ID format: ${id}`);
      }

      const courses = await this.courseModel
        .find({ program: id })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec();

      if (!courses || courses.length === 0) {
        this.logger.warn(`No courses found for program ID: ${id}`);
      }

      return courses;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      this.logger.error(
        `Failed to find courses by program: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to find courses by program: ${error.message}`,
      );
    }
  }

  // Add these functions to the CourseService class

  /**
   * Updates a course and publishes an event
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

      // Check if title is being updated and if it conflicts with existing course
      if (updateCourseInput.title) {
        const existingCourse = await this.courseModel
          .findOne({
            title: updateCourseInput.title,
            _id: { $ne: id },
          })
          .lean();

        if (existingCourse) {
          throw new ConflictException(
            `Course with title "${updateCourseInput.title}" already exists`,
          );
        }
      }

      const updatedCourse = await this.courseModel.findByIdAndUpdate(
        id,
        updateCourseInput,
        { new: true, runValidators: true },
      );

      if (!updatedCourse) {
        throw new NotFoundException(`Course with ID ${id} not found`);
      }

      // Publish event for course update
      await this.pubSub.publish('courseUpdated', {
        courseUpdated: updatedCourse,
      });

      return updatedCourse;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException ||
        error instanceof ConflictException
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
   * Removes a course and publishes an event
   * @param id - The course ID
   * @returns The removed course
   */
  async remove(id: string): Promise<Course> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException(`Invalid course ID format: ${id}`);
      }

      this.logger.log(`Removing course with ID: ${id}`);

      // First check if course exists
      const course = await this.courseModel.findById(id);
      if (!course) {
        throw new NotFoundException(`Course with ID ${id} not found`);
      }

      // Check if course has enrolled students before deletion
      if (course.enrollmentCount && course.enrollmentCount > 0) {
        throw new BadRequestException(
          `Cannot delete course with ${course.enrollmentCount} enrolled students`,
        );
      }

      const deletedCourse = await this.courseModel.findByIdAndDelete(id);

      // Publish event for course deletion
      await this.pubSub.publish('courseDeleted', {
        courseDeleted: deletedCourse,
      });

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
   * Searches courses by title, description, or instructor
   * @param searchTerm - The search term
   * @param limit - Maximum number of results to return
   * @returns Matching courses
   */
  async searchCourses(searchTerm: string, limit = 20): Promise<Course[]> {
    try {
      this.logger.log(`Searching courses with term: ${searchTerm}`);

      if (!searchTerm || searchTerm.trim().length < 2) {
        throw new BadRequestException(
          'Search term must be at least 2 characters long',
        );
      }

      return await this.courseModel
        .find({
          $or: [
            { title: { $regex: searchTerm, $options: 'i' } },
            { description: { $regex: searchTerm, $options: 'i' } },
            { instructorName: { $regex: searchTerm, $options: 'i' } },
            { category: { $regex: searchTerm, $options: 'i' } },
          ],
          isPublished: true, // Only return published courses in search
        })
        .limit(limit)
        .sort({ rating: -1, enrollmentCount: -1 }) // Sort by rating and popularity
        .exec();
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
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

      if (validIds.length === 0) {
        return [];
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

      // Check for duplicate titles
      const titles = createCourseDtos.map((course) => course.title);
      const existingCourses = await this.courseModel
        .find({
          title: { $in: titles },
        })
        .lean();

      if (existingCourses.length > 0) {
        const existingTitles = existingCourses.map((course) => course.title);
        throw new ConflictException(
          `Courses with titles "${existingTitles.join(', ')}" already exist`,
        );
      }

      const createdCourses = await this.courseModel.insertMany(
        createCourseDtos,
        {
          ordered: false,
        },
      );

      // Publish events for each created course
      for (const course of createdCourses) {
        await this.pubSub.publish('courseCreated', { courseCreated: course });
      }

      return createdCourses;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
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

      // Validate IDs
      const invalidIds = updates
        .filter((update) => !Types.ObjectId.isValid(update.id))
        .map((update) => update.id);

      if (invalidIds.length > 0) {
        throw new BadRequestException(
          `Invalid course ID formats: ${invalidIds.join(', ')}`,
        );
      }

      const operations = updates.map((update) => ({
        updateOne: {
          filter: { _id: new Types.ObjectId(update.id) },
          update: { $set: update.data },
        },
      }));

      const result = await this.courseModel.bulkWrite(operations);

      // Publish events for each updated course
      for (const update of updates) {
        const updatedCourse = await this.courseModel.findById(update.id);
        if (updatedCourse) {
          await this.pubSub.publish('courseUpdated', {
            courseUpdated: updatedCourse,
          });
        }
      }

      return result.modifiedCount;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
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

      // Check for courses with enrolled students
      const coursesWithStudents = await this.courseModel
        .find({
          _id: { $in: validIds.map((id) => new Types.ObjectId(id)) },
          enrollmentCount: { $gt: 0 },
        })
        .lean();

      if (coursesWithStudents.length > 0) {
        const courseIds = coursesWithStudents.map((course) =>
          course._id.toString(),
        );
        throw new BadRequestException(
          `Cannot delete courses with IDs ${courseIds.join(', ')} because they have enrolled students`,
        );
      }

      this.logger.log(`Bulk deleting ${validIds.length} courses`);

      // Get courses before deletion for event publishing
      const coursesToDelete = await this.courseModel.find({
        _id: { $in: validIds.map((id) => new Types.ObjectId(id)) },
      });

      const result = await this.courseModel.deleteMany({
        _id: { $in: validIds.map((id) => new Types.ObjectId(id)) },
      });

      this.logger.log(`Successfully deleted ${result.deletedCount} courses`);

      // Publish events for each deleted course
      for (const course of coursesToDelete) {
        await this.pubSub.publish('courseDeleted', { courseDeleted: course });
      }

      // Return true if at least one document was deleted
      return result.deletedCount > 0;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(
        `Failed to bulk delete courses: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to bulk delete courses: ${error.message}`,
      );
    }
  }

  /**
   * Publishes or unpublishes a course
   * @param id - The course ID
   * @param isPublished - Whether to publish or unpublish
   * @returns The updated course
   */
  async togglePublishStatus(id: string, isPublished: boolean): Promise<Course> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException(`Invalid course ID format: ${id}`);
      }

      this.logger.log(
        `${isPublished ? 'Publishing' : 'Unpublishing'} course with ID: ${id}`,
      );

      // Check if course exists
      const course = await this.courseModel.findById(id);
      if (!course) {
        throw new NotFoundException(`Course with ID ${id} not found`);
      }

      // Check if course is ready to be published
      if (isPublished) {
        // Validate course has required fields for publishing
        if (!course.title || !course.description || !course.category) {
          throw new BadRequestException(
            'Course must have title, description, and category to be published',
          );
        }
      }

      const updatedCourse = await this.courseModel.findByIdAndUpdate(
        id,
        { isPublished },
        { new: true, runValidators: true },
      );

      // Publish event for course status change
      await this.pubSub.publish('courseStatusChanged', {
        courseStatusChanged: {
          course: updatedCourse,
          isPublished,
        },
      });

      return updatedCourse;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      this.logger.error(
        `Failed to toggle publish status: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to toggle publish status: ${error.message}`,
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
   * Gets courses by instructor ID
   * @param instructorId - The instructor ID
   * @param page - Current page number
   * @param limit - Maximum number of records per page
   * @returns Paginated instructor courses
   */
  async getCoursesByInstructor(
    instructorId: string,
    page = 1,
    limit = 10,
  ): Promise<PaginationResponse<Course>> {
    try {
      if (!Types.ObjectId.isValid(instructorId)) {
        throw new BadRequestException(
          `Invalid instructor ID format: ${instructorId}`,
        );
      }

      const skip = (page - 1) * limit;

      const [courses, total] = await Promise.all([
        this.courseModel
          .find({ instructor: instructorId })
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 })
          .exec(),
        this.courseModel.countDocuments({ instructor: instructorId }),
      ]);

      return {
        items: courses,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPreviousPage: page > 1,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(
        `Failed to get instructor courses: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to get instructor courses: ${error.message}`,
      );
    }
  }

  /**
   * Gets related courses based on category and tags
   * @param courseId - The reference course ID
   * @param limit - Maximum number of related courses to return
   * @returns Array of related courses
   */
  async getRelatedCourses(courseId: string, limit = 5): Promise<Course[]> {
    try {
      if (!Types.ObjectId.isValid(courseId)) {
        throw new BadRequestException(`Invalid course ID format: ${courseId}`);
      }

      // Get the reference course
      const course = await this.courseModel.findById(courseId);
      if (!course) {
        throw new NotFoundException(`Course with ID ${courseId} not found`);
      }

      // Find courses with the same category or tags, excluding the reference course
      const relatedCourses = await this.courseModel
        .find({
          _id: { $ne: courseId },
          isPublished: true,
          $or: [
            { category: course.category },
            { tags: { $in: course.tags || [] } },
          ],
        })
        .limit(limit)
        .sort({ rating: -1, enrollmentCount: -1 })
        .exec();

      return relatedCourses;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      this.logger.error(
        `Failed to get related courses: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to get related courses: ${error.message}`,
      );
    }
  }

  /**
   * Increments the view count of a course
   * @param id - The course ID
   * @returns The updated view count
   */
  async incrementViewCount(id: string): Promise<number> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException(`Invalid course ID format: ${id}`);
      }

      const result = await this.courseModel.findByIdAndUpdate(
        id,
        { $inc: { viewCount: 1 } },
        { new: true },
      );

      if (!result) {
        throw new NotFoundException(`Course with ID ${id} not found`);
      }

      return result.viewCount;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      this.logger.error(
        `Failed to increment view count: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to increment view count: ${error.message}`,
      );
    }
  }

  /**
   * Updates course rating based on new review
   * @param id - The course ID
   * @param newRating - The new rating value
   * @returns The updated course with new average rating
   */
  async updateCourseRating(id: string, newRating: number): Promise<Course> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException(`Invalid course ID format: ${id}`);
      }

      if (newRating < 1 || newRating > 5) {
        throw new BadRequestException('Rating must be between 1 and 5');
      }

      // Get current course data
      const course = await this.courseModel.findById(id);
      if (!course) {
        throw new NotFoundException(`Course with ID ${id} not found`);
      }

      // Calculate new average rating
      const currentRatingCount = course.ratingCount || 0;
      const currentRating = course.rating || 0;
      const newRatingCount = currentRatingCount + 1;
      const newAverageRating =
        (currentRating * currentRatingCount + newRating) / newRatingCount;

      // Update course with new rating data
      const updatedCourse = await this.courseModel.findByIdAndUpdate(
        id,
        {
          rating: parseFloat(newAverageRating.toFixed(1)),
          ratingCount: newRatingCount,
        },
        { new: true },
      );

      // Publish rating update event
      await this.pubSub.publish('courseRatingUpdated', {
        courseRatingUpdated: updatedCourse,
      });

      return updatedCourse;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      this.logger.error(
        `Failed to update course rating: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to update course rating: ${error.message}`,
      );
    }
  }

  /**
   * Gets featured courses for homepage
   * @param limit - Maximum number of featured courses to return
   * @returns Array of featured courses
   */
  async getFeaturedCourses(limit = 6): Promise<Course[]> {
    try {
      // Get courses that are published, have high ratings, and are marked as featured
      const featuredCourses = await this.courseModel
        .find({
          isPublished: true,
          isFeatured: true,
          rating: { $gte: 4 },
        })
        .sort({ featuredOrder: 1, rating: -1 })
        .limit(limit)
        .exec();

      // If not enough featured courses, supplement with popular courses
      if (featuredCourses.length < limit) {
        const additionalCourses = await this.courseModel
          .find({
            isPublished: true,
            _id: { $nin: featuredCourses.map((c) => c._id) },
          })
          .sort({ enrollmentCount: -1, rating: -1 })
          .limit(limit - featuredCourses.length)
          .exec();

        return [...featuredCourses, ...additionalCourses];
      }

      return featuredCourses;
    } catch (error) {
      this.logger.error(
        `Failed to get featured courses: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to get featured courses: ${error.message}`,
      );
    }
  }

  /**
   * Gets course completion statistics
   * @param id - The course ID
   * @returns Completion statistics
   */
  async getCourseCompletionStats(id: string): Promise<any> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException(`Invalid course ID format: ${id}`);
      }

      // This would typically involve aggregating data from user progress records
      // For now, we'll return a simplified mock implementation
      const course = await this.courseModel.findById(id);
      if (!course) {
        throw new NotFoundException(`Course with ID ${id} not found`);
      }

      // Mock completion statistics
      return {
        courseId: id,
        enrollmentCount: course.enrollmentCount || 0,
        completionCount: Math.floor((course.enrollmentCount || 0) * 0.7), // 70% completion rate
        averageCompletionTime: 14, // days
        dropoutRate: 0.3, // 30%
        moduleCompletionRates: [
          { moduleIndex: 1, completionRate: 0.95 },
          { moduleIndex: 2, completionRate: 0.85 },
          { moduleIndex: 3, completionRate: 0.75 },
          { moduleIndex: 4, completionRate: 0.65 },
        ],
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      this.logger.error(
        `Failed to get course completion stats: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to get course completion stats: ${error.message}`,
      );
    }
  }

  /**
   * Updates course enrollment count
   * @param id - The course ID
   * @param increment - Number to increment by (default 1)
   * @returns The updated course
   */
  async updateEnrollmentCount(id: string, increment = 1): Promise<Course> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException(`Invalid course ID format: ${id}`);
      }

      const updatedCourse = await this.courseModel.findByIdAndUpdate(
        id,
        { $inc: { enrollmentCount: increment } },
        { new: true },
      );

      if (!updatedCourse) {
        throw new NotFoundException(`Course with ID ${id} not found`);
      }

      // Publish enrollment update event
      await this.pubSub.publish('courseEnrollmentUpdated', {
        courseEnrollmentUpdated: {
          course: updatedCourse,
          enrollmentChange: increment,
        },
      });

      return updatedCourse;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      this.logger.error(
        `Failed to update enrollment count: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to update enrollment count: ${error.message}`,
      );
    }
  }
}
/**
 * Updates a course and publishes an event
 * @param id - The course ID
 * @param updateCourseInput - The updated course data
 * @returns The updated course
 */
// async update(
//   id: string,
//   updateCourseInput: UpdateCourseInput,
// ): Promise<Course> {
//   try {
//     if (!Types.ObjectId.isValid(id)) {

// import {
//   Injectable,
//   Logger,
//   NotFoundException,
//   BadRequestException,
// } from '@nestjs/common';
// import { CreateCourseInput } from './dto/create-course.input';
// import { UpdateCourseInput } from './dto/update-course.input';
// import { Course } from './entities/course.entity';
// import { Model, Types } from 'mongoose';
// import { InjectModel } from '@nestjs/mongoose';
// import { RootFilterQuery } from 'mongoose';
// import { CourseFilterDto } from './dto/filter-course';
// import { PaginationResponse } from 'src/common/pagination/pagination-response';

// @Injectable()
// export class CourseService {
//   private readonly logger = new Logger(CourseService.name);

//   constructor(@InjectModel(Course.name) private courseModel: Model<Course>) {}

//   /**
//    * Creates a new course
//    * @param createCourseDto - The course data to create
//    * @returns The created course
//    */
//   async create(createCourseDto: CreateCourseInput): Promise<Course> {
//     try {
//       this.logger.log(
//         `Creating new course: ${createCourseDto.title || 'Untitled'}`,
//       );
//       const createdCourse = await this.courseModel.create(createCourseDto);
//       return createdCourse;
//     } catch (error: any) {
//       this.logger.error(
//         `Failed to create course: ${error.message}`,
//         error.stack,
//       );
//       throw new BadRequestException(
//         `Failed to create course: ${error.message}`,
//       );
//     }
//   }

//   /**
//    * Retrieves all courses with optional pagination
//    * @param skip - Number of records to skip
//    * @param limit - Maximum number of records to return
//    * @returns Array of courses
//    */
//   async findAll(
//     // query?: RootFilterQuery<Course>,
//     skip = 0,
//     limit = 10,
//   ): Promise<Course[]> {
//     try {
//       this.logger.log(
//         `Retrieving all courses with skip=${skip}, limit=${limit}`,
//       );
//       return await this.courseModel
//         .find()
//         .skip(skip)
//         .limit(limit)
//         .sort({ createdAt: -1 })
//         .exec();
//     } catch (error) {
//       this.logger.error(
//         `Failed to retrieve courses: ${error.message}`,
//         error.stack,
//       );
//       throw new BadRequestException(
//         `Failed to retrieve courses: ${error.message}`,
//       );
//     }
//   }

//   /**
//    * Finds courses with advanced filtering
//    * @param filterDto - Filter criteria
//    * @param page - Current page number
//    * @param limit - Maximum number of records per page
//    * @returns Filtered and paginated courses
//    */
//   async findWithFilters(
//     filterDto: CourseFilterDto,
//     page = 1,
//     limit = 10,
//   ): Promise<PaginationResponse<Course>> {
//     try {
//       const skip = (page - 1) * limit;
//       const query: any = {};

//       if (filterDto.title) {
//         query.title = { $regex: filterDto.title, $options: 'i' };
//       }

//       if (filterDto.category) {
//         query.category = filterDto.category;
//       }

//       if (
//         filterDto.minPrice !== undefined ||
//         filterDto.maxPrice !== undefined
//       ) {
//         query.price = {};
//         if (filterDto.minPrice !== undefined) {
//           query.price.$gte = filterDto.minPrice;
//         }
//         if (filterDto.maxPrice !== undefined) {
//           query.price.$lte = filterDto.maxPrice;
//         }
//       }

//       const sortOptions: any = {};
//       if (filterDto.sortBy) {
//         sortOptions[filterDto.sortBy] =
//           filterDto.sortDirection === 'desc' ? -1 : 1;
//       } else {
//         sortOptions.createdAt = -1;
//       }

//       const [courses, total] = await Promise.all([
//         this.courseModel
//           .find(query)
//           .skip(skip)
//           .limit(limit)
//           .sort(sortOptions)
//           .exec(),
//         this.courseModel.countDocuments(query),
//       ]);

//       return {
//         items: courses,
//         total,
//         page,
//         limit,
//         totalPages: Math.ceil(total / limit),
//       };
//     } catch (error) {
//       this.logger.error(
//         `Failed to filter courses: ${error.message}`,
//         error.stack,
//       );
//       throw new BadRequestException(
//         `Failed to filter courses: ${error.message}`,
//       );
//     }
//   }
//   /**
//    * Gets course statistics
//    * @returns Statistics about courses
//    */
//   async getCourseStatistics(): Promise<any> {
//     try {
//       this.logger.log('Retrieving course statistics');

//       const [totalCourses, categoryCounts, avgRating] = await Promise.all([
//         this.countCourses(),
//         this.courseModel.aggregate([
//           { $group: { _id: '$category', count: { $sum: 1 } } },
//           { $sort: { count: -1 } },
//         ]),
//         this.courseModel
//           .aggregate([
//             { $match: { rating: { $exists: true, $ne: null } } },
//             { $group: { _id: null, avgRating: { $avg: '$rating' } } },
//           ])
//           .then((result) => result[0]?.avgRating || 0),
//       ]);

//       return {
//         totalCourses,
//         categoryCounts,
//         avgRating,
//       };
//     } catch (error) {
//       this.logger.error(
//         `Failed to get course statistics: ${error.message}`,
//         error.stack,
//       );
//       throw new BadRequestException(
//         `Failed to get course statistics: ${error.message}`,
//       );
//     }
//   }

//   /**
//    * Finds a course by ID
//    * @param id - The course ID
//    * @returns The found course or null
//    */
//   async findOne(id: string): Promise<Course> {
//     try {
//       if (!Types.ObjectId.isValid(id)) {
//         throw new BadRequestException(`Invalid course ID format: ${id}`);
//       }

//       this.logger.log(`Finding course by ID: ${id}`);
//       const course = await this.courseModel.findById(id);

//       if (!course) {
//         throw new NotFoundException(`Course with ID ${id} not found`);
//       }

//       return course;
//     } catch (error) {
//       if (
//         error instanceof NotFoundException ||
//         error instanceof BadRequestException
//       ) {
//         throw error;
//       }
//       this.logger.error(`Failed to find course: ${error.message}`, error.stack);
//       throw new BadRequestException(`Failed to find course: ${error.message}`);
//     }
//   }

//   /**
//    * Gets the most popular courses based on enrollment count
//    * @param limit - Maximum number of courses to return
//    * @returns Array of popular courses
//    */
//   async getPopularCourses(limit = 5): Promise<Course[]> {
//     try {
//       this.logger.log(`Retrieving ${limit} popular courses`);

//       // Find courses that are published, sort by enrollment count in descending order
//       const popularCourses = await this.courseModel
//         .find({ isPublished: true })
//         .sort({ enrollmentCount: -1, rating: -1 })
//         .limit(limit)
//         .exec();

//       if (popularCourses.length === 0) {
//         this.logger.warn('No popular courses found');
//       }

//       return popularCourses;
//     } catch (error) {
//       this.logger.error(
//         `Failed to retrieve popular courses: ${error.message}`,
//         error.stack,
//       );
//       throw new BadRequestException(
//         `Failed to retrieve popular courses: ${error.message}`,
//       );
//     }
//   }

//   /**
//    * Gets the most recently created courses
//    * @param limit - Maximum number of courses to return
//    * @returns Array of recent courses
//    */
//   async getRecentCourses(limit = 5): Promise<Course[]> {
//     try {
//       this.logger.log(`Retrieving ${limit} recent courses`);

//       // Find courses that are published, sort by creation date in descending order
//       const recentCourses = await this.courseModel
//         .find({ isPublished: true })
//         .sort({ createdAt: -1 })
//         .limit(limit)
//         .exec();

//       if (recentCourses.length === 0) {
//         this.logger.warn('No recent courses found');
//       }

//       return recentCourses;
//     } catch (error) {
//       this.logger.error(
//         `Failed to retrieve recent courses: ${error.message}`,
//         error.stack,
//       );
//       throw new BadRequestException(
//         `Failed to retrieve recent courses: ${error.message}`,
//       );
//     }
//   }

//   /**
//    * Finds courses by program ID
//    * @param id - The program ID
//    * @returns Array of courses in the program
//    */
//   async findCourseByProgram(id: string): Promise<Course[]> {
//     try {
//       this.logger.log(`Finding courses by program ID: ${id}`);
//       const courses = await this.courseModel.find({ program: id });

//       if (!courses || courses.length === 0) {
//         this.logger.warn(`No courses found for program ID: ${id}`);
//       }

//       return courses;
//     } catch (error) {
//       this.logger.error(
//         `Failed to find courses by program: ${error.message}`,
//         error.stack,
//       );
//       throw new BadRequestException(
//         `Failed to find courses by program: ${error.message}`,
//       );
//     }
//   }

//   /**
//    * Updates a course
//    * @param id - The course ID
//    * @param updateCourseInput - The updated course data
//    * @returns The updated course
//    */
//   async update(
//     id: string,
//     updateCourseInput: UpdateCourseInput,
//   ): Promise<Course> {
//     try {
//       if (!Types.ObjectId.isValid(id)) {
//         throw new BadRequestException(`Invalid course ID format: ${id}`);
//       }

//       this.logger.log(`Updating course with ID: ${id}`);
//       const updatedCourse = await this.courseModel.findByIdAndUpdate(
//         id,
//         updateCourseInput,
//         { new: true, runValidators: true },
//       );

//       if (!updatedCourse) {
//         throw new NotFoundException(`Course with ID ${id} not found`);
//       }

//       return updatedCourse;
//     } catch (error) {
//       if (
//         error instanceof NotFoundException ||
//         error instanceof BadRequestException
//       ) {
//         throw error;
//       }
//       this.logger.error(
//         `Failed to update course: ${error.message}`,
//         error.stack,
//       );
//       throw new BadRequestException(
//         `Failed to update course: ${error.message}`,
//       );
//     }
//   }

//   /**
//    * Removes a course
//    * @param id - The course ID
//    * @returns The removed course
//    */
//   async remove(id: string): Promise<Course> {
//     try {
//       if (!Types.ObjectId.isValid(id)) {
//         throw new BadRequestException(`Invalid course ID format: ${id}`);
//       }

//       this.logger.log(`Removing course with ID: ${id}`);
//       const deletedCourse = await this.courseModel.findByIdAndDelete(id);

//       if (!deletedCourse) {
//         throw new NotFoundException(`Course with ID ${id} not found`);
//       }

//       return deletedCourse;
//     } catch (error) {
//       if (
//         error instanceof NotFoundException ||
//         error instanceof BadRequestException
//       ) {
//         throw error;
//       }
//       this.logger.error(
//         `Failed to remove course: ${error.message}`,
//         error.stack,
//       );
//       throw new BadRequestException(
//         `Failed to remove course: ${error.message}`,
//       );
//     }
//   }

//   /**
//    * Searches courses by title or description
//    * @param searchTerm - The search term
//    * @returns Matching courses
//    */
//   async searchCourses(searchTerm: string): Promise<Course[]> {
//     try {
//       this.logger.log(`Searching courses with term: ${searchTerm}`);
//       return await this.courseModel
//         .find({
//           $or: [
//             { title: { $regex: searchTerm, $options: 'i' } },
//             { description: { $regex: searchTerm, $options: 'i' } },
//           ],
//         })
//         .exec();
//     } catch (error) {
//       this.logger.error(
//         `Failed to search courses: ${error.message}`,
//         error.stack,
//       );
//       throw new BadRequestException(
//         `Failed to search courses: ${error.message}`,
//       );
//     }
//   }

//   /**
//    * Counts total courses
//    * @returns Total number of courses
//    */
//   async countCourses(query?: RootFilterQuery<Course>): Promise<number> {
//     try {
//       return await this.courseModel.countDocuments(query);
//     } catch (error) {
//       this.logger.error(
//         `Failed to count courses: ${error.message}`,
//         error.stack,
//       );
//       throw new BadRequestException(
//         `Failed to count courses: ${error.message}`,
//       );
//     }
//   }

//   /**
//    * Finds courses by multiple IDs
//    * @param ids - Array of course IDs
//    * @returns Array of found courses
//    */
//   async findByIds(ids: string[]): Promise<Course[]> {
//     try {
//       const validIds = ids.filter((id) => Types.ObjectId.isValid(id));
//       if (validIds.length !== ids.length) {
//         this.logger.warn(
//           'Some provided course IDs were invalid and will be ignored',
//         );
//       }

//       return await this.courseModel
//         .find({
//           _id: { $in: validIds.map((id) => new Types.ObjectId(id)) },
//         })
//         .exec();
//     } catch (error) {
//       this.logger.error(
//         `Failed to find courses by IDs: ${error.message}`,
//         error.stack,
//       );
//       throw new BadRequestException(
//         `Failed to find courses by IDs: ${error.message}`,
//       );
//     }
//   }

//   /**
//    * Creates multiple courses at once
//    * @param createCourseDtos - Array of course data to create
//    * @returns The created courses
//    */
//   async createMany(createCourseDtos: CreateCourseInput[]): Promise<Course[]> {
//     try {
//       this.logger.log(`Creating ${createCourseDtos.length} new courses`);
//       return await this.courseModel.insertMany(createCourseDtos, {
//         ordered: false,
//       });
//     } catch (error) {
//       this.logger.error(
//         `Failed to create courses in bulk: ${error.message}`,
//         error.stack,
//       );
//       throw new BadRequestException(
//         `Failed to create courses in bulk: ${error.message}`,
//       );
//     }
//   }

//   /**
//    * Updates multiple courses by their IDs
//    * @param updates - Array of {id, data} objects
//    * @returns Number of updated documents
//    */
//   async updateMany(
//     updates: { id: string; data: Partial<UpdateCourseInput> }[],
//   ): Promise<number> {
//     try {
//       this.logger.log(`Updating ${updates.length} courses`);

//       const operations = updates.map((update) => ({
//         updateOne: {
//           filter: { _id: new Types.ObjectId(update.id) },
//           update: { $set: update.data },
//         },
//       }));

//       const result = await this.courseModel.bulkWrite(operations);
//       return result.modifiedCount;
//     } catch (error) {
//       this.logger.error(
//         `Failed to update courses in bulk: ${error.message}`,
//         error.stack,
//       );
//       throw new BadRequestException(
//         `Failed to update courses in bulk: ${error.message}`,
//       );
//     }
//   }

//   /**
//    * Deletes multiple courses by their IDs
//    * @param ids - Array of course IDs to delete
//    * @returns Boolean indicating success
//    */
//   async bulkDelete(ids: string[]): Promise<boolean> {
//     try {
//       // Filter out invalid IDs
//       const validIds = ids.filter((id) => Types.ObjectId.isValid(id));

//       if (validIds.length === 0) {
//         this.logger.warn('No valid course IDs provided for bulk deletion');
//         return false;
//       }

//       if (validIds.length !== ids.length) {
//         this.logger.warn(
//           `${ids.length - validIds.length} invalid course IDs were provided and will be ignored`,
//         );
//       }

//       this.logger.log(`Bulk deleting ${validIds.length} courses`);

//       const result = await this.courseModel.deleteMany({
//         _id: { $in: validIds.map((id) => new Types.ObjectId(id)) },
//       });

//       this.logger.log(`Successfully deleted ${result.deletedCount} courses`);

//       // Return true if at least one document was deleted
//       return result.deletedCount > 0;
//     } catch (error) {
//       this.logger.error(
//         `Failed to bulk delete courses: ${error.message}`,
//         error.stack,
//       );
//       throw new BadRequestException(
//         `Failed to bulk delete courses: ${error.message}`,
//       );
//     }
//   }
// }
