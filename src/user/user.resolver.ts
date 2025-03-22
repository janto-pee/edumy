import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { AddressService } from 'src/address/address.service';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly addressService: AddressService,
  ) {}

  @Mutation(() => User)
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return await this.userService.create(createUserInput);
  }

  @Query(() => [User], { name: 'users' })
  async findAll() {
    return await this.userService.findAll();
  }

  @Query(() => User, { name: 'user' })
  async findOne(@Args('id', { type: () => String }) id: string) {
    return await this.userService.findOne(id);
  }

  @Mutation(() => User)
  async updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return await this.userService.update(updateUserInput.id, updateUserInput);
  }

  @Mutation(() => User)
  async removeUser(@Args('id', { type: () => String }) id: string) {
    return await this.userService.remove(id);
  }

  /**
   * RESOLVER
   */
  @ResolveField()
  async address(@Parent() user: User) {
    const { _id } = user;
    const address = this.addressService.findBy({ userId: _id });
    if (!address) {
      throw new Error(
        'user does not have an addres. Please proceed to create an address for this user',
      );
    }
    return address;
  }
}
