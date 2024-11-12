import { CreateProgramMembershipInput } from './create-program-membership.input';
import { Schema as MongooseSchema } from 'mongoose';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateProgramMembershipInput extends PartialType(
  CreateProgramMembershipInput,
) {
  @Field(() => String)
  _id: MongooseSchema.Types.ObjectId;
}
