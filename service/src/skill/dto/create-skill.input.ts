import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateSkillInput {
  @Field()
  skillName: string;

  @Field()
  skillId: number;
}
