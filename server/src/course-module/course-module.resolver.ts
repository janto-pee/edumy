import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CourseModuleService } from './course-module.service';
import { CourseModule } from './entities/course-module.entity';
import { CreateCourseModuleInput } from './dto/create-course-module.input';
import { UpdateCourseModuleInput } from './dto/update-course-module.input';

@Resolver(() => CourseModule)
export class CourseModuleResolver {
  constructor(private readonly courseModuleService: CourseModuleService) {}

  @Mutation(() => CourseModule)
  createCourseModule(@Args('createCourseModuleInput') createCourseModuleInput: CreateCourseModuleInput) {
    return this.courseModuleService.create(createCourseModuleInput);
  }

  @Query(() => [CourseModule], { name: 'courseModule' })
  findAll() {
    return this.courseModuleService.findAll();
  }

  @Query(() => CourseModule, { name: 'courseModule' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.courseModuleService.findOne(id);
  }

  @Mutation(() => CourseModule)
  updateCourseModule(@Args('updateCourseModuleInput') updateCourseModuleInput: UpdateCourseModuleInput) {
    return this.courseModuleService.update(updateCourseModuleInput.id, updateCourseModuleInput);
  }

  @Mutation(() => CourseModule)
  removeCourseModule(@Args('id', { type: () => Int }) id: number) {
    return this.courseModuleService.remove(id);
  }
}
