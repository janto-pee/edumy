import { CreateCourseMetaDatumInput } from './create-course-meta-datum.input';
import { Schema as MongooseSchema } from 'mongoose';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateCourseMetaDatumInput extends PartialType(
  CreateCourseMetaDatumInput,
) {
  @Field(() => String)
  _id: MongooseSchema.Types.ObjectId;
}
