import { CreateProgrammembershipInput } from './create-programmembership.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';

@InputType()
export class UpdateProgrammembershipInput extends PartialType(
  CreateProgrammembershipInput,
) {
  @Field(() => ID)
  id: string;
}
