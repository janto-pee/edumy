import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CourseModuleService } from './course-module.service';
import { CourseModule } from './entities/course-module.entity';
import { CreateCourseModuleInput } from './dto/create-course-module.input';
import { UpdateCourseModuleInput } from './dto/update-course-module.input';
import { Schema as MongooseSchema } from 'mongoose';

@Resolver(() => CourseModule)
export class CourseModuleResolver {
  constructor(private readonly courseModuleService: CourseModuleService) {}

  @Mutation(() => CourseModule)
  createCourseModule(
    @Args('createCourseModuleInput')
    createCourseModuleInput: CreateCourseModuleInput,
  ) {
    return this.courseModuleService.create(createCourseModuleInput);
  }

  @Query(() => [CourseModule], { name: 'courseModule' })
  findAll() {
    return this.courseModuleService.findAll();
  }

  @Query(() => CourseModule, { name: 'courseModule' })
  findOne(
    @Args('id', { type: () => String }) id: MongooseSchema.Types.ObjectId,
  ) {
    return this.courseModuleService.findOne(id);
  }

  @Mutation(() => CourseModule)
  updateCourseModule(
    @Args('updateCourseModuleInput')
    updateCourseModuleInput: UpdateCourseModuleInput,
  ) {
    return this.courseModuleService.update(
      updateCourseModuleInput._id,
      updateCourseModuleInput,
    );
  }

  @Mutation(() => CourseModule)
  removeCourseModule(
    @Args('id', { type: () => String }) id: MongooseSchema.Types.ObjectId,
  ) {
    return this.courseModuleService.remove(id);
  }
}
