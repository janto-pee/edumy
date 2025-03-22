import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { ContentitemService } from './contentitem.service';
import { Contentitem } from './entities/contentitem.entity';
import { CreateContentitemInput } from './dto/create-contentitem.input';
import { UpdateContentitemInput } from './dto/update-contentitem.input';
import { ContentService } from 'src/content/content.service';

@Resolver(() => Contentitem)
export class ContentitemResolver {
  constructor(
    private readonly contentitemService: ContentitemService,
    private readonly contentService: ContentService,
  ) {}

  @Mutation(() => Contentitem)
  async createContentitem(
    @Args('createContentitemInput')
    createContentitemInput: CreateContentitemInput,
  ) {
    return await this.contentitemService.create(createContentitemInput);
  }

  @Query(() => [Contentitem], { name: 'contentitems' })
  async findAll() {
    return await this.contentitemService.findAll();
  }

  @Query(() => Contentitem, { name: 'contentitem' })
  async findOne(@Args('id', { type: () => String }) id: string) {
    return await this.contentitemService.findOne(id);
  }

  @Mutation(() => Contentitem)
  async updateContentitem(
    @Args('updateContentitemInput')
    updateContentitemInput: UpdateContentitemInput,
  ) {
    return await this.contentitemService.update(
      updateContentitemInput.id,
      updateContentitemInput,
    );
  }

  @Mutation(() => Contentitem)
  async removeContentitem(@Args('id', { type: () => String }) id: string) {
    return await this.contentitemService.remove(id);
  }

  /**
   * RESOLVER
   */
  @ResolveField()
  async content(@Parent() contentItem: Contentitem) {
    const { contentId } = contentItem;
    const content = await this.contentService.findOne(contentId);
    return content;
  }
}
