import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateProgramMembershipInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
