import { CreateCourseMaterialInput } from './create-course-material.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateCourseMaterialInput extends PartialType(CreateCourseMaterialInput) {
  @Field(() => Int)
  id: number;
}
