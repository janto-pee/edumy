import { CreateCourseCurriculumInput } from './create-course-curriculum.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateCourseCurriculumInput extends PartialType(CreateCourseCurriculumInput) {
  @Field(() => Int)
  id: number;
}
