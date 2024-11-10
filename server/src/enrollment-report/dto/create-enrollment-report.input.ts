import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateEnrollmentReportInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
