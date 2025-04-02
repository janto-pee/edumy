import { CreateProgramInput } from './create-program.input';
import { InputType, Field, PartialType, ID } from '@nestjs/graphql';

@InputType()
export class UpdateProgramInput extends PartialType(CreateProgramInput) {
  @Field(() => ID)
  id: string;
}
@InputType()
export class UpdateBulkProgramInput {
  @Field(() => String)
  id: string;

  @Field(() => UpdateProgramInput)
  data: Partial<UpdateProgramInput>;
}
