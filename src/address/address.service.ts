import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateAddressInput } from './dto/create-address.input';
import { UpdateAddressInput } from './dto/update-address.input';
import { Address } from './entities/address.entity';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { RootFilterQuery } from 'mongoose';
import { AddressFilterDto } from './dto/filter-coursemetadatum';
import { PaginationResponse } from 'src/common/pagination/pagination-response';

@Injectable()
export class AddressService {
  private readonly logger = new Logger(AddressService.name);

  constructor(
    @InjectModel(Address.name) private addressModel: Model<Address>,
  ) {}

  /**
   * Creates a new address
   * @param createAddressDto - The address data to create
   * @returns The created address
   */
  async create(createAddressDto: CreateAddressInput): Promise<Address> {
    try {
      this.logger.log(
        `Creating new address: ${createAddressDto.street || 'Untitled'}`,
      );
      const createdAddress = await this.addressModel.create(createAddressDto);
      return createdAddress;
    } catch (error: any) {
      this.logger.error(
        `Failed to create address: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to create address: ${error.message}`,
      );
    }
  }

  /**
   * Retrieves all addresss with optional pagination
   * @param skip - Number of records to skip
   * @param limit - Maximum number of records to return
   * @returns Array of addresss
   */
  async findAll(
    // query?: RootFilterQuery<Address>,
    skip = 0,
    limit = 10,
  ): Promise<Address[]> {
    try {
      this.logger.log(
        `Retrieving all addresss with skip=${skip}, limit=${limit}`,
      );
      return await this.addressModel
        .find()
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec();
    } catch (error) {
      this.logger.error(
        `Failed to retrieve addresss: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to retrieve addresss: ${error.message}`,
      );
    }
  }

  /**
   * Finds addresss with advanced filtering
   * @param filterDto - Filter criteria
   * @param page - Current page number
   * @param limit - Maximum number of records per page
   * @returns Filtered and paginated addresss
   */
  async findWithFilters(
    filterDto: AddressFilterDto,
    page = 1,
    limit = 10,
  ): Promise<PaginationResponse<Address>> {
    try {
      const skip = (page - 1) * limit;
      const query: any = {};

      if (filterDto.street) {
        query.street = { $regex: filterDto.street, $options: 'i' };
      }

      if (filterDto.country) {
        query.country = filterDto.country;
      }
      if (filterDto.country_code) {
        query.country_code = filterDto.country_code;
      }

      if (filterDto.city) {
        query.city = filterDto.city;
      }

      if (filterDto.postal_code) {
        query.postal_code = filterDto.postal_code;
      }

      const sortOptions: any = {};
      if (filterDto.sortBy) {
        sortOptions[filterDto.sortBy] =
          filterDto.sortDirection === 'desc' ? -1 : 1;
      } else {
        sortOptions.createdAt = -1;
      }

      const [addresss, total] = await Promise.all([
        this.addressModel
          .find(query)
          .skip(skip)
          .limit(limit)
          .sort(sortOptions)
          .exec(),
        this.addressModel.countDocuments(query),
      ]);

      return {
        items: addresss,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      this.logger.error(
        `Failed to filter addresss: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to filter addresss: ${error.message}`,
      );
    }
  }
  /**
   * Gets address statistics
   * @returns Statistics about addresss
   */
  async getAddressStatistics(): Promise<any> {
    try {
      this.logger.log('Retrieving address statistics');

      const [totalAddresss, categoryCounts, avgRating] = await Promise.all([
        this.countAddresss(),
        this.addressModel.aggregate([
          { $group: { _id: '$category', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ]),
        this.addressModel
          .aggregate([
            { $match: { rating: { $exists: true, $ne: null } } },
            { $group: { _id: null, avgRating: { $avg: '$rating' } } },
          ])
          .then((result) => result[0]?.avgRating || 0),
      ]);

      return {
        totalAddresss,
        categoryCounts,
        avgRating,
      };
    } catch (error) {
      this.logger.error(
        `Failed to get address statistics: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to get address statistics: ${error.message}`,
      );
    }
  }

  /**
   * Finds a address by ID
   * @param id - The address ID
   * @returns The found address or null
   */
  async findOne(id: string): Promise<Address> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException(`Invalid address ID format: ${id}`);
      }

      this.logger.log(`Finding address by ID: ${id}`);
      const address = await this.addressModel.findById(id);

      if (!address) {
        throw new NotFoundException(`Address with ID ${id} not found`);
      }

      return address;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      this.logger.error(
        `Failed to find address: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(`Failed to find address: ${error.message}`);
    }
  }

  /**
   * Gets the most popular addresss based on enrollment count
   * @param limit - Maximum number of addresss to return
   * @returns Array of popular addresss
   */
  async getPopularAddresss(limit = 5): Promise<Address[]> {
    try {
      this.logger.log(`Retrieving ${limit} popular addresss`);

      // Find addresss that are published, sort by enrollment count in descending order
      const popularAddresss = await this.addressModel
        .find({ isPublished: true })
        .sort({ enrollmentCount: -1, rating: -1 })
        .limit(limit)
        .exec();

      if (popularAddresss.length === 0) {
        this.logger.warn('No popular addresss found');
      }

      return popularAddresss;
    } catch (error) {
      this.logger.error(
        `Failed to retrieve popular addresss: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to retrieve popular addresss: ${error.message}`,
      );
    }
  }

  /**
   * Gets the most recently created addresss
   * @param limit - Maximum number of addresss to return
   * @returns Array of recent addresss
   */
  async getRecentAddresss(limit = 5): Promise<Address[]> {
    try {
      this.logger.log(`Retrieving ${limit} recent addresss`);

      // Find addresss that are published, sort by creation date in descending order
      const recentAddresss = await this.addressModel
        .find({ isPublished: true })
        .sort({ createdAt: -1 })
        .limit(limit)
        .exec();

      if (recentAddresss.length === 0) {
        this.logger.warn('No recent addresss found');
      }

      return recentAddresss;
    } catch (error) {
      this.logger.error(
        `Failed to retrieve recent addresss: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to retrieve recent addresss: ${error.message}`,
      );
    }
  }

  /**
   * Finds addresss by program ID
   * @param id - The program ID
   * @returns Array of addresss in the program
   */
  async findAddressByProgram(id: string): Promise<Address[]> {
    try {
      this.logger.log(`Finding addresss by program ID: ${id}`);
      const addresss = await this.addressModel.find({ program: id });

      if (!addresss || addresss.length === 0) {
        this.logger.warn(`No addresss found for program ID: ${id}`);
      }

      return addresss;
    } catch (error) {
      this.logger.error(
        `Failed to find addresss by program: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to find addresss by program: ${error.message}`,
      );
    }
  }

  /**
   * Updates a address
   * @param id - The address ID
   * @param UpdateAddressInput - The updated address data
   * @returns The updated address
   */
  async update(
    id: string,
    UpdateAddressInput: UpdateAddressInput,
  ): Promise<Address> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException(`Invalid address ID format: ${id}`);
      }

      this.logger.log(`Updating address with ID: ${id}`);
      const updatedAddress = await this.addressModel.findByIdAndUpdate(
        id,
        UpdateAddressInput,
        { new: true, runValidators: true },
      );

      if (!updatedAddress) {
        throw new NotFoundException(`Address with ID ${id} not found`);
      }

      return updatedAddress;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      this.logger.error(
        `Failed to update address: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to update address: ${error.message}`,
      );
    }
  }

  /**
   * Removes a address
   * @param id - The address ID
   * @returns The removed address
   */
  async remove(id: string): Promise<Address> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException(`Invalid address ID format: ${id}`);
      }

      this.logger.log(`Removing address with ID: ${id}`);
      const deletedAddress = await this.addressModel.findByIdAndDelete(id);

      if (!deletedAddress) {
        throw new NotFoundException(`Address with ID ${id} not found`);
      }

      return deletedAddress;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      this.logger.error(
        `Failed to remove address: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to remove address: ${error.message}`,
      );
    }
  }

  /**
   * Searches addresss by title or description
   * @param searchTerm - The search term
   * @returns Matching addresss
   */
  async searchAddresss(searchTerm: string): Promise<Address[]> {
    try {
      this.logger.log(`Searching addresss with term: ${searchTerm}`);
      return await this.addressModel
        .find({
          $or: [
            { title: { $regex: searchTerm, $options: 'i' } },
            { description: { $regex: searchTerm, $options: 'i' } },
          ],
        })
        .exec();
    } catch (error) {
      this.logger.error(
        `Failed to search addresss: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to search addresss: ${error.message}`,
      );
    }
  }

  /**
   * Counts total addresss
   * @returns Total number of addresss
   */
  async countAddresss(query?: RootFilterQuery<Address>): Promise<number> {
    try {
      return await this.addressModel.countDocuments(query);
    } catch (error) {
      this.logger.error(
        `Failed to count addresss: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to count addresss: ${error.message}`,
      );
    }
  }

  /**
   * Finds addresss by multiple IDs
   * @param ids - Array of address IDs
   * @returns Array of found addresss
   */
  async findByIds(ids: string[]): Promise<Address[]> {
    try {
      const validIds = ids.filter((id) => Types.ObjectId.isValid(id));
      if (validIds.length !== ids.length) {
        this.logger.warn(
          'Some provided address IDs were invalid and will be ignored',
        );
      }

      return await this.addressModel
        .find({
          _id: { $in: validIds.map((id) => new Types.ObjectId(id)) },
        })
        .exec();
    } catch (error) {
      this.logger.error(
        `Failed to find addresss by IDs: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to find addresss by IDs: ${error.message}`,
      );
    }
  }

  /**
   * Creates multiple addresss at once
   * @param createAddressDtos - Array of address data to create
   * @returns The created addresss
   */
  async createMany(
    createAddressDtos: CreateAddressInput[],
  ): Promise<Address[]> {
    try {
      this.logger.log(`Creating ${createAddressDtos.length} new addresss`);
      return await this.addressModel.insertMany(createAddressDtos, {
        ordered: false,
      });
    } catch (error) {
      this.logger.error(
        `Failed to create addresss in bulk: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to create addresss in bulk: ${error.message}`,
      );
    }
  }

  /**
   * Updates multiple addresss by their IDs
   * @param updates - Array of {id, data} objects
   * @returns Number of updated documents
   */
  async updateMany(
    updates: { id: string; data: Partial<UpdateAddressInput> }[],
  ): Promise<number> {
    try {
      this.logger.log(`Updating ${updates.length} addresss`);

      const operations = updates.map((update) => ({
        updateOne: {
          filter: { _id: new Types.ObjectId(update.id) },
          update: { $set: update.data },
        },
      }));

      const result = await this.addressModel.bulkWrite(operations);
      return result.modifiedCount;
    } catch (error) {
      this.logger.error(
        `Failed to update addresss in bulk: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to update addresss in bulk: ${error.message}`,
      );
    }
  }

  /**
   * Deletes multiple addresss by their IDs
   * @param ids - Array of address IDs to delete
   * @returns Boolean indicating success
   */
  async bulkDelete(ids: string[]): Promise<boolean> {
    try {
      // Filter out invalid IDs
      const validIds = ids.filter((id) => Types.ObjectId.isValid(id));

      if (validIds.length === 0) {
        this.logger.warn('No valid address IDs provided for bulk deletion');
        return false;
      }

      if (validIds.length !== ids.length) {
        this.logger.warn(
          `${ids.length - validIds.length} invalid address IDs were provided and will be ignored`,
        );
      }

      this.logger.log(`Bulk deleting ${validIds.length} addresss`);

      const result = await this.addressModel.deleteMany({
        _id: { $in: validIds.map((id) => new Types.ObjectId(id)) },
      });

      this.logger.log(`Successfully deleted ${result.deletedCount} addresss`);

      // Return true if at least one document was deleted
      return result.deletedCount > 0;
    } catch (error) {
      this.logger.error(
        `Failed to bulk delete addresss: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to bulk delete addresss: ${error.message}`,
      );
    }
  }
}
