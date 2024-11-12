import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ItemRiskFlagService } from './item-risk-flag.service';
import { ItemRiskFlag } from './entities/item-risk-flag.entity';
import { CreateItemRiskFlagInput } from './dto/create-item-risk-flag.input';
import { UpdateItemRiskFlagInput } from './dto/update-item-risk-flag.input';
import { Schema as MongooseSchema } from 'mongoose';

@Resolver(() => ItemRiskFlag)
export class ItemRiskFlagResolver {
  constructor(private readonly itemRiskFlagService: ItemRiskFlagService) {}

  @Mutation(() => ItemRiskFlag)
  createItemRiskFlag(
    @Args('createItemRiskFlagInput')
    createItemRiskFlagInput: CreateItemRiskFlagInput,
  ) {
    return this.itemRiskFlagService.create(createItemRiskFlagInput);
  }

  @Query(() => [ItemRiskFlag], { name: 'itemRiskFlag' })
  findAll() {
    return this.itemRiskFlagService.findAll();
  }

  @Query(() => ItemRiskFlag, { name: 'itemRiskFlag' })
  findOne(
    @Args('id', { type: () => String }) id: MongooseSchema.Types.ObjectId,
  ) {
    return this.itemRiskFlagService.findOne(id);
  }

  @Mutation(() => ItemRiskFlag)
  updateItemRiskFlag(
    @Args('updateItemRiskFlagInput')
    updateItemRiskFlagInput: UpdateItemRiskFlagInput,
  ) {
    return this.itemRiskFlagService.update(
      updateItemRiskFlagInput._id,
      updateItemRiskFlagInput,
    );
  }

  @Mutation(() => ItemRiskFlag)
  removeItemRiskFlag(
    @Args('id', { type: () => String }) id: MongooseSchema.Types.ObjectId,
  ) {
    return this.itemRiskFlagService.remove(id);
  }
}
