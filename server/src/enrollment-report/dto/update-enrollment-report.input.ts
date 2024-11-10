import { CreateEnrollmentReportInput } from './create-enrollment-report.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateEnrollmentReportInput extends PartialType(CreateEnrollmentReportInput) {
  @Field(() => Int)
  id: number;
}
