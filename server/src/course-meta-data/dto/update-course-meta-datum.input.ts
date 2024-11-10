import { CreateCourseMetaDatumInput } from './create-course-meta-datum.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateCourseMetaDatumInput extends PartialType(CreateCourseMetaDatumInput) {
  @Field(() => Int)
  id: number;
}
