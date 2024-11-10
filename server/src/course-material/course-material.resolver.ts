import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CourseMaterialService } from './course-material.service';
import { CourseMaterial } from './entities/course-material.entity';
import { CreateCourseMaterialInput } from './dto/create-course-material.input';
import { UpdateCourseMaterialInput } from './dto/update-course-material.input';

@Resolver(() => CourseMaterial)
export class CourseMaterialResolver {
  constructor(private readonly courseMaterialService: CourseMaterialService) {}

  @Mutation(() => CourseMaterial)
  createCourseMaterial(@Args('createCourseMaterialInput') createCourseMaterialInput: CreateCourseMaterialInput) {
    return this.courseMaterialService.create(createCourseMaterialInput);
  }

  @Query(() => [CourseMaterial], { name: 'courseMaterial' })
  findAll() {
    return this.courseMaterialService.findAll();
  }

  @Query(() => CourseMaterial, { name: 'courseMaterial' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.courseMaterialService.findOne(id);
  }

  @Mutation(() => CourseMaterial)
  updateCourseMaterial(@Args('updateCourseMaterialInput') updateCourseMaterialInput: UpdateCourseMaterialInput) {
    return this.courseMaterialService.update(updateCourseMaterialInput.id, updateCourseMaterialInput);
  }

  @Mutation(() => CourseMaterial)
  removeCourseMaterial(@Args('id', { type: () => Int }) id: number) {
    return this.courseMaterialService.remove(id);
  }
}
