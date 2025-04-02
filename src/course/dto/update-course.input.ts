import { CreateCourseInput } from './create-course.input';
import { InputType, Field, PartialType, ID } from '@nestjs/graphql';

@InputType()
export class UpdateCourseInput extends PartialType(CreateCourseInput) {
  @Field(() => ID)
  id: string;
}

@InputType()
export class UpdateBulkCourseInput {
  @Field(() => String)
  id: string;

  @Field(() => UpdateCourseInput)
  data: Partial<UpdateCourseInput>;
}
