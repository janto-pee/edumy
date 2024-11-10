import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateInstructorInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
