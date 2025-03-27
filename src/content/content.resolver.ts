import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { ContentService } from './content.service';
import { Content } from './entities/content.entity';
import { CreateContentInput } from './dto/create-content.input';
import { UpdateContentInput } from './dto/update-content.input';
import { ContentitemService } from 'src/contentitem/contentitem.service';

@Resolver(() => Content)
export class ContentResolver {
  constructor(
    private readonly contentService: ContentService,
    private readonly contentItemService: ContentitemService,
  ) {}

  @Mutation(() => Content)
  async createContent(
    @Args('createContentInput') createContentInput: CreateContentInput,
  ) {
    return await this.contentService.create(createContentInput);
  }

  @Query(() => [Content], { name: 'contents' })
  async findAll() {
    return await this.contentService.findAll();
  }

  @Query(() => Content, { name: 'content' })
  async findOne(@Args('id', { type: () => String }) id: string) {
    return await this.contentService.findOne(id);
  }

  @Mutation(() => Content)
  async updateContent(
    @Args('updateContentInput') updateContentInput: UpdateContentInput,
  ) {
    return await this.contentService.update(
      updateContentInput.id,
      updateContentInput,
    );
  }

  @Mutation(() => Content)
  async removeContent(@Args('id', { type: () => String }) id: string) {
    return await this.contentService.remove(id);
  }

  /**
   * RESOLVER
   */
  @ResolveField()
  async contentitem(@Parent() content: Content) {
    const { contentItemId } = content;
    const contentItem = await this.contentItemService.findOne(contentItemId);
    return contentItem;
  }
}
