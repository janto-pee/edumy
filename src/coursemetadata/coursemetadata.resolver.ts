import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CoursemetadataService } from './coursemetadata.service';
import { Coursemetada } from './entities/coursemetadatum.entity';
import { CreateCoursemetadatumInput } from './dto/create-coursemetadatum.input';
import { UpdateCoursemetadatumInput } from './dto/update-coursemetadatum.input';

@Resolver(() => Coursemetada)
export class CoursemetadataResolver {
  constructor(private readonly coursemetadataService: CoursemetadataService) {}

  @Mutation(() => Coursemetada)
  createCoursemetadatum(
    @Args('createCoursemetadatumInput')
    createCoursemetadatumInput: CreateCoursemetadatumInput,
  ) {
    return this.coursemetadataService.create(createCoursemetadatumInput);
  }

  @Query(() => [Coursemetada], { name: 'coursemetadata' })
  findAll() {
    return this.coursemetadataService.findAll();
  }

  @Query(() => Coursemetada, { name: 'coursemetadatum' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.coursemetadataService.findOne(id);
  }

  @Mutation(() => Coursemetada)
  updateCoursemetadatum(
    @Args('updateCoursemetadatumInput')
    updateCoursemetadatumInput: UpdateCoursemetadatumInput,
  ) {
    return this.coursemetadataService.update(
      updateCoursemetadatumInput.id,
      updateCoursemetadatumInput,
    );
  }

  @Mutation(() => Coursemetada)
  removeCoursemetadatum(@Args('id', { type: () => Int }) id: number) {
    return this.coursemetadataService.remove(id);
  }
}
