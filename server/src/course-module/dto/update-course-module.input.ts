import { CreateCourseModuleInput } from './create-course-module.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateCourseModuleInput extends PartialType(CreateCourseModuleInput) {
  @Field(() => Int)
  id: number;
}
