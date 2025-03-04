import { CreateEnrollmentInput } from './create-enrollment.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateEnrollmentInput extends PartialType(CreateEnrollmentInput) {
  @Field(() => Int)
  id: number;
}
