import { CreateProgramInput } from './create-program.input';
import { InputType, Field, PartialType, ID } from '@nestjs/graphql';

@InputType()
export class UpdateProgramInput extends PartialType(CreateProgramInput) {
  @Field(() => ID)
  id: string;
}
