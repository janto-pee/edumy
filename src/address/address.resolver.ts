import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
  Int,
} from '@nestjs/graphql';
import { GqlAuthGuard } from 'src/auth/gqll-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Subscription } from '@nestjs/graphql';
import { Inject, Logger, UseGuards } from '@nestjs/common';

import { AddressService } from './address.service';
import { Address } from './entities/address.entity';
import { CreateAddressInput } from './dto/create-address.input';
import {
  UpdateBulkAddressInput,
  UpdateAddressInput,
} from './dto/update-address.input';
import { SkillService } from 'src/skill/skill.service';
import { ContentService } from 'src/content/content.service';
import { AddressPaginationResponse } from './dto/pagination-response';
import { AddressFilterDto } from './dto/filter-coursemetadatum';
import { RolesGuard } from 'src/auth/role.gurad';
import { PubSub } from 'graphql-subscriptions';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { User } from 'src/user/entities/user.entity';

@Resolver(() => Address)
export class AddressResolver {
  private readonly logger = new Logger(AddressResolver.name);

  constructor(
    private readonly addressService: AddressService,
    @Inject('PUB_SUB') private pubSub: PubSub,
  ) {}

  @Mutation(() => Address)
  @UseGuards(GqlAuthGuard)
  async createAddress(
    @Args('createAddressInput') createAddressInput: CreateAddressInput,
    @CurrentUser() user: User,
  ) {
    try {
      const address = await this.addressService.create({
        ...createAddressInput,
        createdBy: user._id,
      });
      this.pubSub.publish('addressCreated', { addressCreated: address });
      return address;
    } catch (error) {
      this.logger.error(
        `Failed to create address: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Query(() => AddressPaginationResponse, { name: 'addresss' })
  async findAll(
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
  ) {
    try {
      return await this.addressService.findAll(page, limit);
    } catch (error) {
      this.logger.error(
        `Failed to fetch addresss: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Query(() => AddressPaginationResponse, { name: 'filteredAddresss' })
  async findWithFilters(
    @Args('filter') filter: AddressFilterDto,
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
  ) {
    try {
      return await this.addressService.findWithFilters(filter, page, limit);
    } catch (error) {
      this.logger.error(
        `Failed to fetch filtered addresss: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Query(() => Address, { name: 'address' })
  async findOne(@Args('id', { type: () => String }) id: string) {
    try {
      return await this.addressService.findOne(id);
    } catch (error) {
      this.logger.error(
        `Failed to fetch address with id ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Query(() => [Address], { name: 'searchAddresss' })
  async searchAddresss(
    @Args('searchTerm', { type: () => String }) searchTerm: string,
  ) {
    try {
      return await this.addressService.searchAddresss(searchTerm);
    } catch (error) {
      this.logger.error(
        `Failed to search addresss with term '${searchTerm}': ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  // @Query(() => Object, { name: 'addressStatistics' })
  // @UseGuards(GqlAuthGuard, RolesGuard)
  // @Roles('ADMIN', 'INSTRUCTOR')
  // async getAddressStatistics() {
  //   try {
  //     return await this.addressService.getAddressStatistics();
  //   } catch (error) {
  //     this.logger.error(
  //       `Failed to get address statistics: ${error.message}`,
  //       error.stack,
  //     );
  //     throw error;
  //   }
  // }

  @Mutation(() => Address)
  @UseGuards(GqlAuthGuard)
  async updateAddress(
    @Args('updateAddressInput') updateAddressInput: UpdateAddressInput,
    @CurrentUser() user: User,
  ) {
    try {
      const address = await this.addressService.update(
        updateAddressInput.id,
        updateAddressInput,
      );
      this.pubSub.publish('addressUpdated', { addressUpdated: address });
      return address;
    } catch (error) {
      this.logger.error(
        `Failed to update address: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Mutation(() => [Address])
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN', 'INSTRUCTOR')
  async createManyAddresss(
    @Args('createAddressInputs', { type: () => [CreateAddressInput] })
    createAddressInputs: CreateAddressInput[],
    @CurrentUser() user: User,
  ) {
    try {
      const addresssWithCreator = createAddressInputs.map((input) => ({
        ...input,
        createdBy: user._id,
      }));
      return await this.addressService.createMany(addresssWithCreator);
    } catch (error) {
      this.logger.error(
        `Failed to create multiple addresss: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Mutation(() => Int)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN', 'INSTRUCTOR')
  async updateManyAddresss(
    @Args('updates', { type: () => [UpdateBulkAddressInput] })
    updates: { id: string; data: Partial<UpdateAddressInput> }[],
  ) {
    try {
      return await this.addressService.updateMany(updates);
    } catch (error) {
      this.logger.error(
        `Failed to update multiple addresss: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Mutation(() => Address)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async removeAddress(@Args('id', { type: () => String }) id: string) {
    try {
      const address = await this.addressService.remove(id);
      this.pubSub.publish('addressDeleted', { addressDeleted: address });
      return address;
    } catch (error) {
      this.logger.error(
        `Failed to remove address with id ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async bulkDeleteAddresss(
    @Args('ids', { type: () => [String] }) ids: string[],
  ) {
    try {
      const result = await this.addressService.bulkDelete(ids);
      return result;
    } catch (error) {
      this.logger.error(
        `Failed to bulk delete addresss: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Query(() => [Address], { name: 'popularAddresss' })
  async getPopularAddresss(
    @Args('limit', { type: () => Int, defaultValue: 5 }) limit: number,
  ) {
    try {
      return await this.addressService.getPopularAddresss(limit);
    } catch (error) {
      this.logger.error(
        `Failed to fetch popular addresss: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Query(() => [Address], { name: 'recentAddresss' })
  async getRecentAddresss(
    @Args('limit', { type: () => Int, defaultValue: 5 }) limit: number,
  ) {
    try {
      return await this.addressService.getRecentAddresss(limit);
    } catch (error) {
      this.logger.error(
        `Failed to fetch recent addresss: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * RESOLVER FIELDS
   */

  @ResolveField()
  async creator(@Parent() address: Address) {
    try {
      const { createdBy } = address;
      if (!createdBy) return null;
      // Assuming you have a user service to fetch user details
      // return await this.userService.findOne(createdBy);
      return null; // Replace with actual implementation
    } catch (error) {
      this.logger.error(
        `Failed to resolve creator for address: ${error.message}`,
        error.stack,
      );
      return null;
    }
  }

  /**
   * Subscriptions
   * for real time updates
   */
  @Subscription(() => Address)
  addressCreated() {
    return this.pubSub.asyncIterableIterator('addressCreated');
  }

  @Subscription(() => Address)
  addressUpdated() {
    return this.pubSub.asyncIterableIterator('addressUpdated');
  }

  @Subscription(() => Address)
  addressDeleted() {
    return this.pubSub.asyncIterableIterator('addressDeleted');
  }
}
