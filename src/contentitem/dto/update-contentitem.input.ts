import { CreateContentitemInput } from './create-contentitem.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateContentitemInput extends PartialType(CreateContentitemInput) {
  @Field(() => Int)
  id: number;
}
