import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateCourseCurriculumInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
