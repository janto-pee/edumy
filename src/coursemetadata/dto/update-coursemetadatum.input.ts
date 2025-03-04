import { CreateCoursemetadatumInput } from './create-coursemetadatum.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateCoursemetadatumInput extends PartialType(CreateCoursemetadatumInput) {
  @Field(() => Int)
  id: number;
}
