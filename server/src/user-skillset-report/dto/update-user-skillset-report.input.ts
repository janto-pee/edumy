import { CreateUserSkillsetReportInput } from './create-user-skillset-report.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateUserSkillsetReportInput extends PartialType(CreateUserSkillsetReportInput) {
  @Field(() => Int)
  id: number;
}
