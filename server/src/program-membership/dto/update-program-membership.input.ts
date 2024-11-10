import { CreateProgramMembershipInput } from './create-program-membership.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateProgramMembershipInput extends PartialType(CreateProgramMembershipInput) {
  @Field(() => Int)
  id: number;
}
