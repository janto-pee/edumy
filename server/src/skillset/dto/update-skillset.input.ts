import { CreateSkillsetInput } from './create-skillset.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateSkillsetInput extends PartialType(CreateSkillsetInput) {
  @Field(() => Int)
  id: number;
}
