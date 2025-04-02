import { InputType, Field, PartialType, ID } from '@nestjs/graphql';
import { CreateContentItemInput } from './create-contentitem.input';

@InputType()
export class UpdateContentItemInput extends PartialType(
  CreateContentItemInput,
) {
  @Field(() => ID)
  id: string;
}
@InputType()
export class UpdateBulkContentItemInput {
  @Field(() => String)
  id: string;

  @Field(() => UpdateContentItemInput)
  data: Partial<UpdateContentItemInput>;
}
