import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateItemRiskFlagInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
