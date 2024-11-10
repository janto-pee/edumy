import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateSkillsetInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
