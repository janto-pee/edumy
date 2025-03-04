import { CreateContentitemInput } from './create-contentitem.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';

@InputType()
export class UpdateContentitemInput extends PartialType(
  CreateContentitemInput,
) {
  @Field(() => ID)
  id: string;
}
