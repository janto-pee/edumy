import { CreateSkillInput } from './create-skill.input';
import { InputType, Field, PartialType, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class UpdateSkillInput extends PartialType(CreateSkillInput) {
  @Field(() => ID)
  @IsNotEmpty()
  @IsString()
  id: string;
}

@InputType()
export class UpdateBulkSkillInput {
  @Field(() => String)
  id: string;

  @Field(() => UpdateSkillInput)
  data: Partial<UpdateSkillInput>;
}
