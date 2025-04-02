import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
  Int,
} from '@nestjs/graphql';
import { UserService } from './user.service';
import { User, UserRole } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { FilterUserDto } from './dto/filter-user.dto';
import { ChangePasswordInput } from './dto/change-password.input';
import { AddressService } from 'src/address/address.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/gqll-auth.guard';
import { RolesGuard } from 'src/auth/role.gurad';
import { Roles } from 'src/auth/roles.decorator';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { Logger } from '@nestjs/common';
import { PaginatedUserResponse } from './dto/pagination-response.dto';

@Resolver(() => User)
export class UserResolver {
  private readonly logger = new Logger(UserResolver.name);

  constructor(
    private readonly userService: UserService,
    private readonly addressService: AddressService,
  ) {}

  @Mutation(() => User)
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    this.logger.log(`Creating user with username: ${createUserInput.username}`);
    return await this.userService.create(createUserInput);
  }

  @Query(() => PaginatedUserResponse, { name: 'users' })
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findAll(
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
  ) {
    this.logger.log(`Fetching users with page=${page}, limit=${limit}`);
    return await this.userService.findAll(page, limit);
  }

  @Query(() => PaginatedUserResponse, { name: 'filteredUsers' })
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findWithFilters(
    @Args('filter') filter: FilterUserDto,
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
  ) {
    this.logger.log(`Filtering users with criteria: ${JSON.stringify(filter)}`);
    return await this.userService.findWithFilters(filter, page, limit);
  }

  @Query(() => User, { name: 'user' })
  @UseGuards(GqlAuthGuard)
  async findOne(
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() currentUser: User,
  ) {
    // Allow users to fetch their own profile or admins to fetch any profile
    if (id !== currentUser._id && currentUser.role !== UserRole.ADMIN) {
      throw new Error('You are not authorized to view this user profile');
    }

    this.logger.log(`Fetching user with ID: ${id}`);
    return await this.userService.findOne(id);
  }

  @Query(() => User, { name: 'me' })
  @UseGuards(GqlAuthGuard)
  async getMe(@CurrentUser() currentUser: User) {
    this.logger.log(`Fetching current user profile: ${currentUser._id}`);
    return await this.userService.findOne(currentUser._id);
  }

  @Mutation(() => User)
  @UseGuards(GqlAuthGuard)
  async updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @CurrentUser() currentUser: User,
  ) {
    // Allow users to update their own profile or admins to update any profile
    if (
      updateUserInput.id !== currentUser._id &&
      currentUser.role !== UserRole.ADMIN
    ) {
      throw new Error('You are not authorized to update this user profile');
    }

    // Only admins can change roles
    if (updateUserInput.role && currentUser.role !== UserRole.ADMIN) {
      throw new Error('Only administrators can change user roles');
    }

    this.logger.log(`Updating user with ID: ${updateUserInput.id}`);
    return await this.userService.update(updateUserInput.id, updateUserInput);
  }

  @Mutation(() => User)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async removeUser(@Args('id', { type: () => String }) id: string) {
    this.logger.log(`Removing user with ID: ${id}`);
    return await this.userService.remove(id);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async changePassword(
    @Args('changePasswordInput') changePasswordInput: ChangePasswordInput,
    @CurrentUser() currentUser: User,
  ) {
    this.logger.log(`Changing password for user: ${currentUser._id}`);
    const result = await this.userService.changePassword(
      currentUser._id,
      changePasswordInput,
    );
    return result.success;
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async verifyUserEmail(@Args('id', { type: () => String }) id: string) {
    this.logger.log(`Admin verifying email for user: ${id}`);
    const result = await this.userService.update(id, {
      id: id,
      is_email_verified: true,
    });
    return !!result;
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async updateUserInterests(
    @Args('interests', { type: () => [String] }) interests: string[],
    @CurrentUser() currentUser: User,
  ) {
    this.logger.log(`Updating interests for user: ${currentUser._id}`);
    const result = await this.userService.update(currentUser._id, {
      id: currentUser._id,
      interests,
    });
    return !!result;
  }

  /**
   * RESOLVER FIELDS
   */
  @ResolveField()
  async address(@Parent() user: User) {
    const { _id } = user;
    try {
      const address = await this.addressService.findOne(_id);
      if (!address) {
        return null;
      }
      return address;
    } catch (error) {
      this.logger.warn(`Address not found for user ${_id}`);
      return null;
    }
  }

  @ResolveField()
  fullName(@Parent() user: User) {
    return `${user.first_name} ${user.last_name}`;
  }
}
