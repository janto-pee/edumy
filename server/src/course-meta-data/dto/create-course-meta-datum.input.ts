import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateCourseMetaDatumInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
