import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User, UserRole } from './entities/user.entity';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { hashPassword, comparePasswords } from 'src/utils/hashPassword';
import { v4 as uuidv4 } from 'uuid';
// import { PaginationResponse } from 'src/course/dto/pagination-response';
import { FilterUserDto } from './dto/filter-user.dto';
import { ChangePasswordInput } from './dto/change-password.input';
import { PaginatedUserResponse } from './dto/pagination-response.dto';
import { PaginationResponse } from 'src/common/pagination/pagination-response';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  /**
   * Creates a new user
   * @param createUserDto - User data to create
   * @returns The created user
   */
  async create(createUserDto: CreateUserInput) {
    try {
      this.logger.log(`Creating new user with email: ${createUserDto.email}`);

      // Check if user with email or username already exists
      const existingUser = await this.userModel.findOne({
        $or: [
          { email: createUserDto.email },
          { username: createUserDto.username },
        ],
      });

      if (existingUser) {
        if (existingUser.email === createUserDto.email) {
          throw new ConflictException('Email already in use');
        }
        throw new ConflictException('Username already taken');
      }

      const hashedPassword = await hashPassword(createUserDto.password);

      const createdUser = await this.userModel.create({
        ...createUserDto,
        password: hashedPassword,
        verificationCode: uuidv4(),
        role: createUserDto.role || UserRole.USER,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Remove password from response
      // const userResponse = createdUser.toObject();
      const { password, verificationCode, ...userResponse } =
        createdUser.toObject();
      // delete userResponse.password;
      // delete userResponse.verificationCode;

      return userResponse;
    } catch (error) {
      this.logger.error(`Failed to create user: ${error.message}`, error.stack);
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException(`Failed to create user: ${error.message}`);
    }
  }

  /**
   * Retrieves all users with pagination
   * @param page - Page number
   * @param limit - Maximum number of records per page
   * @returns Paginated list of users
   */
  async findAll(page = 1, limit = 10): Promise<PaginationResponse<User>> {
    try {
      const skip = (page - 1) * limit;

      this.logger.log(`Retrieving all users with page=${page}, limit=${limit}`);

      const [users, total] = await Promise.all([
        this.userModel
          .find()
          .select('-password -verificationCode -passwordResetCode')
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 })
          .exec(),
        this.userModel.countDocuments(),
      ]);

      return {
        items: users,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      this.logger.error(
        `Failed to retrieve users: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to retrieve users: ${error.message}`,
      );
    }
  }

  /**
   * Finds users with advanced filtering and pagination
   * @param filterDto - Filter criteria
   * @param page - Current page number
   * @param limit - Maximum number of records per page
   * @returns Filtered and paginated users
   */
  async findWithFilters(
    filterDto: FilterUserDto,
    page = 1,
    limit = 10,
  ): Promise<PaginationResponse<User>> {
    try {
      const skip = (page - 1) * limit;
      const query: any = {};

      if (filterDto.search) {
        query.$or = [
          { username: { $regex: filterDto.search, $options: 'i' } },
          { email: { $regex: filterDto.search, $options: 'i' } },
          { first_name: { $regex: filterDto.search, $options: 'i' } },
          { last_name: { $regex: filterDto.search, $options: 'i' } },
        ];
      }

      if (filterDto.role) {
        query.role = filterDto.role;
      }

      if (filterDto.is_active !== undefined) {
        query.is_active = filterDto.is_active;
      }

      if (filterDto.is_email_verified !== undefined) {
        query.is_email_verified = filterDto.is_email_verified;
      }

      const sortOptions: any = {};
      if (filterDto.sortBy) {
        sortOptions[filterDto.sortBy] =
          filterDto.sortDirection === 'desc' ? -1 : 1;
      } else {
        sortOptions.createdAt = -1;
      }

      const [users, total] = await Promise.all([
        this.userModel
          .find(query)
          .select('-password -verificationCode -passwordResetCode')
          .skip(skip)
          .limit(limit)
          .sort(sortOptions)
          .exec(),
        this.userModel.countDocuments(query),
      ]);

      return {
        items: users,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      this.logger.error(
        `Failed to filter users: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(`Failed to filter users: ${error.message}`);
    }
  }

  // /**
  //  * Finds users with filtering
  //  * @param filterDto - Filter criteria
  //  * @param page - Page number
  //  * @param limit - Items per page
  //  * @returns Filtered and paginated users
  //  */
  // async findWithFilters(
  //   filterDto: FilterUserDto,
  //   page = 1,
  //   limit = 10,
  // ): Promise<PaginationResponse<User>> {
  //   try {
  //     const skip = (page - 1) * limit;
  //     const query: any = {};

  //     if (filterDto.search) {
  //       query.$or = [
  //         { username: { $regex: filterDto.search, $options: 'i' } },
  //         { email: { $regex: filterDto.search, $options: 'i' } },
  //         { first_name: { $regex: filterDto.search, $options: 'i' } },
  //         { last_name: { $regex: filterDto.search, $options: 'i' } },
  //       ];
  //     }

  //     if (filterDto.role) {
  //       query.role = filterDto.role;
  //     }

  //     if (filterDto.is_active !== undefined) {
  //       query.is_active = filterDto.is_active;
  //     }

  //     if (filterDto.is_email_verified !== undefined) {
  //       query.is_email_verified = filterDto.is_email_verified;
  //     }

  //     const sortOptions: any = {};
  //     if (filterDto.sortBy) {
  //       sortOptions[filterDto.sortBy] =
  //         filterDto.sortDirection === 'desc' ? -1 : 1;
  //     } else {
  //       sortOptions.createdAt = -1;
  //     }

  //     const [users, total] = await Promise.all([
  //       this.userModel
  //         .find(query)
  //         .select('-password -verificationCode -passwordResetCode')
  //         .skip(skip)
  //         .limit(limit)
  //         .sort(sortOptions)
  //         .exec(),
  //       this.userModel.countDocuments(query),
  //     ]);

  //     return {
  //       items: users,
  //       total,
  //       page,
  //       limit,
  //       totalPages: Math.ceil(total / limit),
  //     };
  //   } catch (error) {
  //     this.logger.error(
  //       `Failed to filter users: ${error.message}`,
  //       error.stack,
  //     );
  //     throw new BadRequestException(`Failed to filter users: ${error.message}`);
  //   }
  // }

  /**
   * Finds a user by ID
   * @param id - User ID
   * @returns The found user
   */
  async findOne(id: string): Promise<User> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException(`Invalid user ID format: ${id}`);
      }

      this.logger.log(`Finding user by ID: ${id}`);
      const user = await this.userModel
        .findById(id)
        .select('-password -verificationCode -passwordResetCode');

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      return user;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      this.logger.error(`Failed to find user: ${error.message}`, error.stack);
      throw new BadRequestException(`Failed to find user: ${error.message}`);
    }
  }

  /**
   * Finds a user by email
   * @param email - User email
   * @returns The found user
   */
  async findByEmail(email: string): Promise<User> {
    try {
      this.logger.log(`Finding user by email: ${email}`);
      const user = await this.userModel.findOne({ email });

      if (!user) {
        throw new NotFoundException(`User with email ${email} not found`);
      }

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to find user by email: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to find user by email: ${error.message}`,
      );
    }
  }

  /**
   * Finds a user by username
   * @param username - Username
   * @returns The found user
   */
  async findByUsername(username: string): Promise<User> {
    try {
      this.logger.log(`Finding user by username: ${username}`);
      const user = await this.userModel.findOne({ username });

      if (!user) {
        throw new NotFoundException(`User with username ${username} not found`);
      }

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to find user by username: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to find user by username: ${error.message}`,
      );
    }
  }

  /**
   * Updates a user
   * @param id - User ID
   * @param updateUserInput - Updated user data
   * @returns The updated user
   */
  async update(id: string, updateUserInput: UpdateUserInput): Promise<User> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException(`Invalid user ID format: ${id}`);
      }

      this.logger.log(`Updating user with ID: ${id}`);

      // Check if email or username is being changed and if they're already taken
      if (updateUserInput.email || updateUserInput.username) {
        const query: any = { _id: { $ne: id } };

        if (updateUserInput.email) {
          query.email = updateUserInput.email;
        }

        if (updateUserInput.username) {
          query.username = updateUserInput.username;
        }

        const existingUser = await this.userModel.findOne(query);

        if (existingUser) {
          if (
            updateUserInput.email &&
            existingUser.email === updateUserInput.email
          ) {
            throw new ConflictException('Email already in use');
          }
          if (
            updateUserInput.username &&
            existingUser.username === updateUserInput.username
          ) {
            throw new ConflictException('Username already taken');
          }
        }
      }

      // Add updatedAt timestamp
      const updatedData = {
        ...updateUserInput,
        updatedAt: new Date(),
      };

      const updatedUser = await this.userModel
        .findByIdAndUpdate(id, updatedData, { new: true, runValidators: true })
        .select('-password -verificationCode -passwordResetCode');

      if (!updatedUser) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      return updatedUser;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      this.logger.error(`Failed to update user: ${error.message}`, error.stack);
      throw new BadRequestException(`Failed to update user: ${error.message}`);
    }
  }

  /**
   * Changes a user's password
   * @param id - User ID
   * @param changePasswordInput - Old and new password
   * @returns Success message
   */
  async changePassword(
    id: string,
    changePasswordInput: ChangePasswordInput,
  ): Promise<{ success: boolean; message: string }> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException(`Invalid user ID format: ${id}`);
      }

      this.logger.log(`Changing password for user with ID: ${id}`);

      // Find user with password field
      const user = await this.userModel.findById(id).select('+password');

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      // Verify old password
      const isPasswordValid = await comparePasswords(
        changePasswordInput.oldPassword,
        user.password,
      );

      if (!isPasswordValid) {
        throw new BadRequestException('Current password is incorrect');
      }

      // Hash and update new password
      const hashedPassword = await hashPassword(
        changePasswordInput.newPassword,
      );

      await this.userModel.updateOne({ _id: id }, { password: hashedPassword });
      this.logger.log(`Password changed successfully for user with ID: ${id}`);
      return {
        success: true,
        message: 'Password changed successfully',
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      this.logger.error(
        `Failed to change password: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to change password: ${error.message}`,
      );
    }
  }

  /**
   * Removes a skill
   * @param id - Skill ID
   * @returns The removed skill
   */
  async remove(id: string): Promise<User> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException(`Invalid skill ID format: ${id}`);
      }

      this.logger.log(`Removing skill with ID: ${id}`);
      const deletedUser = await this.userModel.findByIdAndDelete(id);

      if (!deletedUser) {
        throw new NotFoundException(`Skill with ID ${id} not found`);
      }

      return deletedUser;
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
}
