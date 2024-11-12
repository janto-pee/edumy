import { CreateCourseMaterialInput } from './create-course-material.input';
import { Schema as MongooseSchema } from 'mongoose';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateCourseMaterialInput extends PartialType(
  CreateCourseMaterialInput,
) {
  @Field(() => String)
  _id: MongooseSchema.Types.ObjectId;
}
