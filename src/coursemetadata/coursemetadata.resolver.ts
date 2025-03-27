import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CoursemetadataService } from './coursemetadata.service';
import { Coursemetada } from './entities/coursemetadatum.entity';
import { CreateCoursemetadatumInput } from './dto/create-coursemetadatum.input';
import { UpdateCoursemetadatumInput } from './dto/update-coursemetadatum.input';

@Resolver(() => Coursemetada)
export class CoursemetadataResolver {
  constructor(private readonly coursemetadataService: CoursemetadataService) {}

  @Mutation(() => Coursemetada)
  async createCoursemetadatum(
    @Args('createCoursemetadatumInput')
    createCoursemetadatumInput: CreateCoursemetadatumInput,
  ) {
    return await this.coursemetadataService.create(createCoursemetadatumInput);
  }

  @Query(() => [Coursemetada], { name: 'coursemetadatas' })
  async findAll() {
    return await this.coursemetadataService.findAll();
  }

  @Query(() => Coursemetada, { name: 'coursemetadatum' })
  async findOne(@Args('id', { type: () => String }) id: string) {
    return await this.coursemetadataService.findOne(id);
  }

  @Mutation(() => Coursemetada)
  async updateCoursemetadatum(
    @Args('updateCoursemetadatumInput')
    updateCoursemetadatumInput: UpdateCoursemetadatumInput,
  ) {
    return await this.coursemetadataService.update(
      updateCoursemetadatumInput.id,
      updateCoursemetadatumInput,
    );
  }

  @Mutation(() => Coursemetada)
  async removeCoursemetadatum(@Args('id', { type: () => String }) id: string) {
    return await this.coursemetadataService.remove(id);
  }
}
