import { CreateCourseModuleInput } from './create-course-module.input';
import { Schema as MongooseSchema } from 'mongoose';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateCourseModuleInput extends PartialType(
  CreateCourseModuleInput,
) {
  @Field(() => String)
  _id: MongooseSchema.Types.ObjectId;
}
