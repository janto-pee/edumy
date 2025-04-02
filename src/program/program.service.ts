import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateProgramInput } from './dto/create-program.input';
import { UpdateProgramInput } from './dto/update-program.input';
import { Program } from './entities/program.entity';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { RootFilterQuery } from 'mongoose';
import { ProgramFilterDto } from './dto/filter-program';
import { PaginationResponse } from 'src/common/pagination/pagination-response';

@Injectable()
export class ProgramService {
  private readonly logger = new Logger(ProgramService.name);

  constructor(
    @InjectModel(Program.name) private programModel: Model<Program>,
  ) {}

  /**
   * Creates a new program
   * @param createProgramDto - The program data to create
   * @returns The created program
   */
  async create(createProgramDto: CreateProgramInput): Promise<Program> {
    try {
      this.logger.log(
        `Creating new program: ${createProgramDto.title || 'Untitled'}`,
      );
      const createdProgram = await this.programModel.create(createProgramDto);
      return createdProgram;
    } catch (error: any) {
      this.logger.error(
        `Failed to create program: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to create program: ${error.message}`,
      );
    }
  }

  /**
   * Retrieves all programs with optional pagination
   * @param skip - Number of records to skip
   * @param limit - Maximum number of records to return
   * @returns Array of programs
   */
  async findAll(
    // query?: RootFilterQuery<Program>,
    skip = 0,
    limit = 10,
  ): Promise<Program[]> {
    try {
      this.logger.log(
        `Retrieving all programs with skip=${skip}, limit=${limit}`,
      );
      return await this.programModel
        .find()
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec();
    } catch (error) {
      this.logger.error(
        `Failed to retrieve programs: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to retrieve programs: ${error.message}`,
      );
    }
  }

  /**
   * Finds programs with advanced filtering
   * @param filterDto - Filter criteria
   * @param page - Current page number
   * @param limit - Maximum number of records per page
   * @returns Filtered and paginated programs
   */
  async findWithFilters(
    filterDto: ProgramFilterDto,
    page = 1,
    limit = 10,
  ): Promise<PaginationResponse<Program>> {
    try {
      const skip = (page - 1) * limit;
      const query: any = {};

      if (filterDto.title) {
        query.title = { $regex: filterDto.title, $options: 'i' };
      }

      if (filterDto.url) {
        query.url = filterDto.url;
      }

      const sortOptions: any = {};
      if (filterDto.sortBy) {
        sortOptions[filterDto.sortBy] =
          filterDto.sortDirection === 'desc' ? -1 : 1;
      } else {
        sortOptions.createdAt = -1;
      }

      const [programs, total] = await Promise.all([
        this.programModel
          .find(query)
          .skip(skip)
          .limit(limit)
          .sort(sortOptions)
          .exec(),
        this.programModel.countDocuments(query),
      ]);

      return {
        items: programs,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      this.logger.error(
        `Failed to filter programs: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to filter programs: ${error.message}`,
      );
    }
  }
  /**
   * Gets program statistics
   * @returns Statistics about programs
   */
  async getProgramStatistics(): Promise<any> {
    try {
      this.logger.log('Retrieving program statistics');

      const [totalPrograms, categoryCounts, avgRating] = await Promise.all([
        this.countPrograms(),
        this.programModel.aggregate([
          { $group: { _id: '$category', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ]),
        this.programModel
          .aggregate([
            { $match: { rating: { $exists: true, $ne: null } } },
            { $group: { _id: null, avgRating: { $avg: '$rating' } } },
          ])
          .then((result) => result[0]?.avgRating || 0),
      ]);

      return {
        totalPrograms,
        categoryCounts,
        avgRating,
      };
    } catch (error) {
      this.logger.error(
        `Failed to get program statistics: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to get program statistics: ${error.message}`,
      );
    }
  }

  /**
   * Finds a program by ID
   * @param id - The program ID
   * @returns The found program or null
   */
  async findOne(id: string): Promise<Program> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException(`Invalid program ID format: ${id}`);
      }

      this.logger.log(`Finding program by ID: ${id}`);
      const program = await this.programModel.findById(id);

      if (!program) {
        throw new NotFoundException(`Program with ID ${id} not found`);
      }

      return program;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      this.logger.error(
        `Failed to find program: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(`Failed to find program: ${error.message}`);
    }
  }

  /**
   * Gets the most popular programs based on enrollment count
   * @param limit - Maximum number of programs to return
   * @returns Array of popular programs
   */
  async getPopularPrograms(limit = 5): Promise<Program[]> {
    try {
      this.logger.log(`Retrieving ${limit} popular programs`);

      // Find programs that are published, sort by enrollment count in descending order
      const popularPrograms = await this.programModel
        .find({ isPublished: true })
        .sort({ enrollmentCount: -1, rating: -1 })
        .limit(limit)
        .exec();

      if (popularPrograms.length === 0) {
        this.logger.warn('No popular programs found');
      }

      return popularPrograms;
    } catch (error) {
      this.logger.error(
        `Failed to retrieve popular programs: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to retrieve popular programs: ${error.message}`,
      );
    }
  }

  /**
   * Gets the most recently created programs
   * @param limit - Maximum number of programs to return
   * @returns Array of recent programs
   */
  async getRecentPrograms(limit = 5): Promise<Program[]> {
    try {
      this.logger.log(`Retrieving ${limit} recent programs`);

      // Find programs that are published, sort by creation date in descending order
      const recentPrograms = await this.programModel
        .find({ isPublished: true })
        .sort({ createdAt: -1 })
        .limit(limit)
        .exec();

      if (recentPrograms.length === 0) {
        this.logger.warn('No recent programs found');
      }

      return recentPrograms;
    } catch (error) {
      this.logger.error(
        `Failed to retrieve recent programs: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to retrieve recent programs: ${error.message}`,
      );
    }
  }

  /**
   * Finds programs by program ID
   * @param id - The program ID
   * @returns Array of programs in the program
   */
  async findProgramByProgram(id: string): Promise<Program[]> {
    try {
      this.logger.log(`Finding programs by program ID: ${id}`);
      const programs = await this.programModel.find({ program: id });

      if (!programs || programs.length === 0) {
        this.logger.warn(`No programs found for program ID: ${id}`);
      }

      return programs;
    } catch (error) {
      this.logger.error(
        `Failed to find programs by program: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to find programs by program: ${error.message}`,
      );
    }
  }

  /**
   * Updates a program
   * @param id - The program ID
   * @param updateProgramInput - The updated program data
   * @returns The updated program
   */
  async update(
    id: string,
    updateProgramInput: UpdateProgramInput,
  ): Promise<Program> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException(`Invalid program ID format: ${id}`);
      }

      this.logger.log(`Updating program with ID: ${id}`);
      const updatedProgram = await this.programModel.findByIdAndUpdate(
        id,
        updateProgramInput,
        { new: true, runValidators: true },
      );

      if (!updatedProgram) {
        throw new NotFoundException(`Program with ID ${id} not found`);
      }

      return updatedProgram;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      this.logger.error(
        `Failed to update program: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to update program: ${error.message}`,
      );
    }
  }

  /**
   * Removes a program
   * @param id - The program ID
   * @returns The removed program
   */
  async remove(id: string): Promise<Program> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException(`Invalid program ID format: ${id}`);
      }

      this.logger.log(`Removing program with ID: ${id}`);
      const deletedProgram = await this.programModel.findByIdAndDelete(id);

      if (!deletedProgram) {
        throw new NotFoundException(`Program with ID ${id} not found`);
      }

      return deletedProgram;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      this.logger.error(
        `Failed to remove program: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to remove program: ${error.message}`,
      );
    }
  }

  /**
   * Searches programs by title or description
   * @param searchTerm - The search term
   * @returns Matching programs
   */
  async searchPrograms(searchTerm: string): Promise<Program[]> {
    try {
      this.logger.log(`Searching programs with term: ${searchTerm}`);
      return await this.programModel
        .find({
          $or: [
            { title: { $regex: searchTerm, $options: 'i' } },
            { description: { $regex: searchTerm, $options: 'i' } },
          ],
        })
        .exec();
    } catch (error) {
      this.logger.error(
        `Failed to search programs: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to search programs: ${error.message}`,
      );
    }
  }

  /**
   * Counts total programs
   * @returns Total number of programs
   */
  async countPrograms(query?: RootFilterQuery<Program>): Promise<number> {
    try {
      return await this.programModel.countDocuments(query);
    } catch (error) {
      this.logger.error(
        `Failed to count programs: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to count programs: ${error.message}`,
      );
    }
  }

  /**
   * Finds programs by multiple IDs
   * @param ids - Array of program IDs
   * @returns Array of found programs
   */
  async findByIds(ids: string[]): Promise<Program[]> {
    try {
      const validIds = ids.filter((id) => Types.ObjectId.isValid(id));
      if (validIds.length !== ids.length) {
        this.logger.warn(
          'Some provided program IDs were invalid and will be ignored',
        );
      }

      return await this.programModel
        .find({
          _id: { $in: validIds.map((id) => new Types.ObjectId(id)) },
        })
        .exec();
    } catch (error) {
      this.logger.error(
        `Failed to find programs by IDs: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to find programs by IDs: ${error.message}`,
      );
    }
  }

  /**
   * Creates multiple programs at once
   * @param createProgramDtos - Array of program data to create
   * @returns The created programs
   */
  async createMany(
    createProgramDtos: CreateProgramInput[],
  ): Promise<Program[]> {
    try {
      this.logger.log(`Creating ${createProgramDtos.length} new programs`);
      return await this.programModel.insertMany(createProgramDtos, {
        ordered: false,
      });
    } catch (error) {
      this.logger.error(
        `Failed to create programs in bulk: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to create programs in bulk: ${error.message}`,
      );
    }
  }

  /**
   * Updates multiple programs by their IDs
   * @param updates - Array of {id, data} objects
   * @returns Number of updated documents
   */
  async updateMany(
    updates: { id: string; data: Partial<UpdateProgramInput> }[],
  ): Promise<number> {
    try {
      this.logger.log(`Updating ${updates.length} programs`);

      const operations = updates.map((update) => ({
        updateOne: {
          filter: { _id: new Types.ObjectId(update.id) },
          update: { $set: update.data },
        },
      }));

      const result = await this.programModel.bulkWrite(operations);
      return result.modifiedCount;
    } catch (error) {
      this.logger.error(
        `Failed to update programs in bulk: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to update programs in bulk: ${error.message}`,
      );
    }
  }

  /**
   * Deletes multiple programs by their IDs
   * @param ids - Array of program IDs to delete
   * @returns Boolean indicating success
   */
  async bulkDelete(ids: string[]): Promise<boolean> {
    try {
      // Filter out invalid IDs
      const validIds = ids.filter((id) => Types.ObjectId.isValid(id));

      if (validIds.length === 0) {
        this.logger.warn('No valid program IDs provided for bulk deletion');
        return false;
      }

      if (validIds.length !== ids.length) {
        this.logger.warn(
          `${ids.length - validIds.length} invalid program IDs were provided and will be ignored`,
        );
      }

      this.logger.log(`Bulk deleting ${validIds.length} programs`);

      const result = await this.programModel.deleteMany({
        _id: { $in: validIds.map((id) => new Types.ObjectId(id)) },
      });

      this.logger.log(`Successfully deleted ${result.deletedCount} programs`);

      // Return true if at least one document was deleted
      return result.deletedCount > 0;
    } catch (error) {
      this.logger.error(
        `Failed to bulk delete programs: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to bulk delete programs: ${error.message}`,
      );
    }
  }
}
