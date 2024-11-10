import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateItemGradeInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
