import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateEnrollmentStateInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
