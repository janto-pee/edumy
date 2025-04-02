import { CreateCourseMetaDatumInput } from './create-coursemetadatum.input';
import { InputType, Field, PartialType, ID } from '@nestjs/graphql';

@InputType()
export class UpdateCourseMetaDatumInput extends PartialType(
  CreateCourseMetaDatumInput,
) {
  @Field(() => ID)
  id: string;
}
@InputType()
export class UpdateBulkCourseMetaDatumInput {
  @Field(() => String)
  id: string;

  @Field(() => UpdateCourseMetaDatumInput)
  data: Partial<UpdateCourseMetaDatumInput>;
}
