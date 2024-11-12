import { CreateEnrollmentReportInput } from './create-enrollment-report.input';
import { Schema as MongooseSchema } from 'mongoose';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateEnrollmentReportInput extends PartialType(
  CreateEnrollmentReportInput,
) {
  @Field(() => String)
  _id: MongooseSchema.Types.ObjectId;
}
