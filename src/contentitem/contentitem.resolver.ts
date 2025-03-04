import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ContentitemService } from './contentitem.service';
import { Contentitem } from './entities/contentitem.entity';
import { CreateContentitemInput } from './dto/create-contentitem.input';
import { UpdateContentitemInput } from './dto/update-contentitem.input';

@Resolver(() => Contentitem)
export class ContentitemResolver {
  constructor(private readonly contentitemService: ContentitemService) {}

  @Mutation(() => Contentitem)
  createContentitem(
    @Args('createContentitemInput')
    createContentitemInput: CreateContentitemInput,
  ) {
    return this.contentitemService.create(createContentitemInput);
  }

  @Query(() => [Contentitem], { name: 'contentitem' })
  findAll() {
    return this.contentitemService.findAll();
  }

  @Query(() => Contentitem, { name: 'contentitem' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.contentitemService.findOne(id);
  }

  @Mutation(() => Contentitem)
  updateContentitem(
    @Args('updateContentitemInput')
    updateContentitemInput: UpdateContentitemInput,
  ) {
    return this.contentitemService.update(
      updateContentitemInput.id,
      updateContentitemInput,
    );
  }

  @Mutation(() => Contentitem)
  removeContentitem(@Args('id', { type: () => Int }) id: number) {
    return this.contentitemService.remove(id);
  }
}
