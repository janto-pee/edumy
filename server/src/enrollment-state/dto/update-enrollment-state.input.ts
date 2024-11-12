import { CreateEnrollmentStateInput } from './create-enrollment-state.input';
import { Schema as MongooseSchema } from 'mongoose';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateEnrollmentStateInput extends PartialType(
  CreateEnrollmentStateInput,
) {
  @Field(() => String)
  _id: MongooseSchema.Types.ObjectId;
}
