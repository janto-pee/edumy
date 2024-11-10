import { CreateInstructorInput } from './create-instructor.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateInstructorInput extends PartialType(CreateInstructorInput) {
  @Field(() => Int)
  id: number;
}
