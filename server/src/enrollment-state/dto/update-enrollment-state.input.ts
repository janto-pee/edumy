import { CreateEnrollmentStateInput } from './create-enrollment-state.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateEnrollmentStateInput extends PartialType(CreateEnrollmentStateInput) {
  @Field(() => Int)
  id: number;
}
