import { CreateUserSkillsetReportInput } from './create-user-skillset-report.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { Schema as MongooseSchema } from 'mongoose';

@InputType()
export class UpdateUserSkillsetReportInput extends PartialType(
  CreateUserSkillsetReportInput,
) {
  @Field(() => String)
  _id: MongooseSchema.Types.ObjectId;
}
