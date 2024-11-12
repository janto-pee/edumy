import { CreateProgramInput } from './create-program.input';
import { Schema as MongooseSchema } from 'mongoose';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateProgramInput extends PartialType(CreateProgramInput) {
  @Field(() => String)
  _id: MongooseSchema.Types.ObjectId;
}
