import { CreateInstructorInput } from './create-instructor.input';
import { Schema as MongooseSchema } from 'mongoose';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateInstructorInput extends PartialType(CreateInstructorInput) {
  @Field(() => String)
  _id: MongooseSchema.Types.ObjectId;
}
