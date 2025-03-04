import { CreateEnrollmentInput } from './create-enrollment.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';

@InputType()
export class UpdateEnrollmentInput extends PartialType(CreateEnrollmentInput) {
  @Field(() => ID)
  id: string;
}
