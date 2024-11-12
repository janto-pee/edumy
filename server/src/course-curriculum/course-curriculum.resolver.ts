import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CourseCurriculumService } from './course-curriculum.service';
import { CourseCurriculum } from './entities/course-curriculum.entity';
import { CreateCourseCurriculumInput } from './dto/create-course-curriculum.input';
import { UpdateCourseCurriculumInput } from './dto/update-course-curriculum.input';
import { Schema as MongooseSchema } from 'mongoose';

@Resolver(() => CourseCurriculum)
export class CourseCurriculumResolver {
  constructor(
    private readonly courseCurriculumService: CourseCurriculumService,
  ) {}

  @Mutation(() => CourseCurriculum)
  createCourseCurriculum(
    @Args('createCourseCurriculumInput')
    createCourseCurriculumInput: CreateCourseCurriculumInput,
  ) {
    return this.courseCurriculumService.create(createCourseCurriculumInput);
  }

  @Query(() => [CourseCurriculum], { name: 'courseCurriculum' })
  findAll() {
    return this.courseCurriculumService.findAll();
  }

  @Query(() => CourseCurriculum, { name: 'courseCurriculum' })
  findOne(
    @Args('id', { type: () => String }) id: MongooseSchema.Types.ObjectId,
  ) {
    return this.courseCurriculumService.findOne(id);
  }

  @Mutation(() => CourseCurriculum)
  updateCourseCurriculum(
    @Args('updateCourseCurriculumInput')
    updateCourseCurriculumInput: UpdateCourseCurriculumInput,
  ) {
    return this.courseCurriculumService.update(
      updateCourseCurriculumInput._id,
      updateCourseCurriculumInput,
    );
  }

  @Mutation(() => CourseCurriculum)
  removeCourseCurriculum(
    @Args('id', { type: () => String }) id: MongooseSchema.Types.ObjectId,
  ) {
    return this.courseCurriculumService.remove(id);
  }
}
