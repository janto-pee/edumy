import { CreateCoursemetadatumInput } from './create-coursemetadatum.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';

@InputType()
export class UpdateCoursemetadatumInput extends PartialType(
  CreateCoursemetadatumInput,
) {
  @Field(() => ID)
  id: string;
}
