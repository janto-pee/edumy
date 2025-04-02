import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateSkillInput } from './dto/create-skill.input';
import { UpdateSkillInput } from './dto/update-skill.input';
import { Skill } from './entities/skill.entity';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { RootFilterQuery } from 'mongoose';
import { SkillFilterDto } from './dto/filter-coursemetadatum';
import { PaginationResponse } from 'src/common/pagination/pagination-response';

@Injectable()
export class SkillService {
  private readonly logger = new Logger(SkillService.name);

  constructor(@InjectModel(Skill.name) private courseModel: Model<Skill>) {}

  /**
   * Creates a new skill
   * @param createSkillDto - The skill data to create
   * @returns The created skill
   */
  async create(createSkillDto: CreateSkillInput): Promise<Skill> {
    try {
      this.logger.log(
        `Creating new skill: ${createSkillDto.name || 'Untitled'}`,
      );
      const createdSkill = await this.courseModel.create(createSkillDto);
      return createdSkill;
    } catch (error: any) {
      this.logger.error(
        `Failed to create skill: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(`Failed to create skill: ${error.message}`);
    }
  }

  /**
   * Retrieves all courses with optional pagination
   * @param skip - Number of records to skip
   * @param limit - Maximum number of records to return
   * @returns Array of courses
   */
  async findAll(
    // query?: RootFilterQuery<Skill>,
    skip = 0,
    limit = 10,
  ): Promise<Skill[]> {
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
    filterDto: SkillFilterDto,
    page = 1,
    limit = 10,
  ): Promise<PaginationResponse<Skill>> {
    try {
      const skip = (page - 1) * limit;
      const query: any = {};

      if (filterDto.name) {
        query.title = { $regex: filterDto.name, $options: 'i' };
      }

      if (filterDto.category) {
        query.category = filterDto.category;
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
   * Gets skill statistics
   * @returns Statistics about courses
   */
  async getSkillStatistics(): Promise<any> {
    try {
      this.logger.log('Retrieving skill statistics');

      const [totalSkills, categoryCounts, avgRating] = await Promise.all([
        this.countSkills(),
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
        totalSkills,
        categoryCounts,
        avgRating,
      };
    } catch (error) {
      this.logger.error(
        `Failed to get skill statistics: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to get skill statistics: ${error.message}`,
      );
    }
  }

  /**
   * Finds a skill by ID
   * @param id - The skill ID
   * @returns The found skill or null
   */
  async findOne(id: string): Promise<Skill> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException(`Invalid skill ID format: ${id}`);
      }

      this.logger.log(`Finding skill by ID: ${id}`);
      const skill = await this.courseModel.findById(id);

      if (!skill) {
        throw new NotFoundException(`Skill with ID ${id} not found`);
      }

      return skill;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      this.logger.error(`Failed to find skill: ${error.message}`, error.stack);
      throw new BadRequestException(`Failed to find skill: ${error.message}`);
    }
  }

  /**
   * Gets the most popular courses based on enrollment count
   * @param limit - Maximum number of courses to return
   * @returns Array of popular courses
   */
  async getPopularSkills(limit = 5): Promise<Skill[]> {
    try {
      this.logger.log(`Retrieving ${limit} popular courses`);

      // Find courses that are published, sort by enrollment count in descending order
      const popularSkills = await this.courseModel
        .find({ isPublished: true })
        .sort({ enrollmentCount: -1, rating: -1 })
        .limit(limit)
        .exec();

      if (popularSkills.length === 0) {
        this.logger.warn('No popular courses found');
      }

      return popularSkills;
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
  async getRecentSkills(limit = 5): Promise<Skill[]> {
    try {
      this.logger.log(`Retrieving ${limit} recent courses`);

      // Find courses that are published, sort by creation date in descending order
      const recentSkills = await this.courseModel
        .find({ isPublished: true })
        .sort({ createdAt: -1 })
        .limit(limit)
        .exec();

      if (recentSkills.length === 0) {
        this.logger.warn('No recent courses found');
      }

      return recentSkills;
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
  async findSkillByProgram(id: string): Promise<Skill[]> {
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
   * Updates a skill
   * @param id - The skill ID
   * @param updateSkillInput - The updated skill data
   * @returns The updated skill
   */
  async update(id: string, updateSkillInput: UpdateSkillInput): Promise<Skill> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException(`Invalid skill ID format: ${id}`);
      }

      this.logger.log(`Updating skill with ID: ${id}`);
      const updatedSkill = await this.courseModel.findByIdAndUpdate(
        id,
        updateSkillInput,
        { new: true, runValidators: true },
      );

      if (!updatedSkill) {
        throw new NotFoundException(`Skill with ID ${id} not found`);
      }

      return updatedSkill;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      this.logger.error(
        `Failed to update skill: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(`Failed to update skill: ${error.message}`);
    }
  }

  /**
   * Removes a skill
   * @param id - The skill ID
   * @returns The removed skill
   */
  async remove(id: string): Promise<Skill> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException(`Invalid skill ID format: ${id}`);
      }

      this.logger.log(`Removing skill with ID: ${id}`);
      const deletedSkill = await this.courseModel.findByIdAndDelete(id);

      if (!deletedSkill) {
        throw new NotFoundException(`Skill with ID ${id} not found`);
      }

      return deletedSkill;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      this.logger.error(
        `Failed to remove skill: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(`Failed to remove skill: ${error.message}`);
    }
  }

  /**
   * Searches courses by title or description
   * @param searchTerm - The search term
   * @returns Matching courses
   */
  async searchSkills(searchTerm: string): Promise<Skill[]> {
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
  async countSkills(query?: RootFilterQuery<Skill>): Promise<number> {
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
   * @param ids - Array of skill IDs
   * @returns Array of found courses
   */
  async findByIds(ids: string[]): Promise<Skill[]> {
    try {
      const validIds = ids.filter((id) => Types.ObjectId.isValid(id));
      if (validIds.length !== ids.length) {
        this.logger.warn(
          'Some provided skill IDs were invalid and will be ignored',
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
   * @param createSkillDtos - Array of skill data to create
   * @returns The created courses
   */
  async createMany(createSkillDtos: CreateSkillInput[]): Promise<Skill[]> {
    try {
      this.logger.log(`Creating ${createSkillDtos.length} new courses`);
      return await this.courseModel.insertMany(createSkillDtos, {
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
    updates: { id: string; data: Partial<UpdateSkillInput> }[],
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
   * @param ids - Array of skill IDs to delete
   * @returns Boolean indicating success
   */
  async bulkDelete(ids: string[]): Promise<boolean> {
    try {
      // Filter out invalid IDs
      const validIds = ids.filter((id) => Types.ObjectId.isValid(id));

      if (validIds.length === 0) {
        this.logger.warn('No valid skill IDs provided for bulk deletion');
        return false;
      }

      if (validIds.length !== ids.length) {
        this.logger.warn(
          `${ids.length - validIds.length} invalid skill IDs were provided and will be ignored`,
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
