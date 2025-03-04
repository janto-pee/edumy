import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateProgrammembershipInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
