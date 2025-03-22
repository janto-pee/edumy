import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { AddressService } from './address.service';
import { Address } from './entities/address.entity';
import { CreateAddressInput } from './dto/create-address.input';
import { UpdateAddressInput } from './dto/update-address.input';
import { UserService } from 'src/user/user.service';

@Resolver(() => Address)
export class AddressResolver {
  constructor(
    private readonly addressService: AddressService,
    private readonly userService: UserService,
  ) {}

  @Mutation(() => Address)
  async createAddress(
    @Args('createAddressInput') createAddressInput: CreateAddressInput,
  ) {
    return await this.addressService.create(createAddressInput);
  }

  @Query(() => [Address], { name: 'addresses' })
  async findAll() {
    return await this.addressService.findAll();
  }

  @Query(() => Address, { name: 'address' })
  async findOne(@Args('id', { type: () => String }) id: string) {
    return await this.addressService.findOne(id);
  }

  @Mutation(() => Address)
  async updateAddress(
    @Args('updateAddressInput') updateAddressInput: UpdateAddressInput,
  ) {
    return await this.addressService.update(
      updateAddressInput._id,
      updateAddressInput,
    );
  }

  @Mutation(() => Address)
  async removeAddress(@Args('id', { type: () => String }) id: string) {
    return await this.addressService.remove(id);
  }

  /**
   * RESOLVER
   */
  @ResolveField()
  async user(@Parent() address: Address) {
    const { userId } = address;
    const user = await this.userService.findOne(userId);

    return user;
  }
}
