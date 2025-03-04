import { CreateProgrammembershipInput } from './create-programmembership.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateProgrammembershipInput extends PartialType(CreateProgrammembershipInput) {
  @Field(() => Int)
  id: number;
}
