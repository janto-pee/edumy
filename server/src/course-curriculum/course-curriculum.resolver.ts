import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CourseCurriculumService } from './course-curriculum.service';
import { CourseCurriculum } from './entities/course-curriculum.entity';
import { CreateCourseCurriculumInput } from './dto/create-course-curriculum.input';
import { UpdateCourseCurriculumInput } from './dto/update-course-curriculum.input';

@Resolver(() => CourseCurriculum)
export class CourseCurriculumResolver {
  constructor(private readonly courseCurriculumService: CourseCurriculumService) {}

  @Mutation(() => CourseCurriculum)
  createCourseCurriculum(@Args('createCourseCurriculumInput') createCourseCurriculumInput: CreateCourseCurriculumInput) {
    return this.courseCurriculumService.create(createCourseCurriculumInput);
  }

  @Query(() => [CourseCurriculum], { name: 'courseCurriculum' })
  findAll() {
    return this.courseCurriculumService.findAll();
  }

  @Query(() => CourseCurriculum, { name: 'courseCurriculum' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.courseCurriculumService.findOne(id);
  }

  @Mutation(() => CourseCurriculum)
  updateCourseCurriculum(@Args('updateCourseCurriculumInput') updateCourseCurriculumInput: UpdateCourseCurriculumInput) {
    return this.courseCurriculumService.update(updateCourseCurriculumInput.id, updateCourseCurriculumInput);
  }

  @Mutation(() => CourseCurriculum)
  removeCourseCurriculum(@Args('id', { type: () => Int }) id: number) {
    return this.courseCurriculumService.remove(id);
  }
}
