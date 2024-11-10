import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateCourseGradeReportInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
