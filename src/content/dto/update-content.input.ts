import { CreateContentInput } from './create-content.input';
import { InputType, Field, PartialType, ID } from '@nestjs/graphql';

@InputType()
export class UpdateContentInput extends PartialType(CreateContentInput) {
  @Field(() => ID)
  id: string;
}
@InputType()
export class UpdateBulkContentInput {
  @Field(() => String)
  id: string;

  @Field(() => UpdateContentInput)
  data: Partial<UpdateContentInput>;
}
