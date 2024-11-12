import { CreateCourseCurriculumInput } from './create-course-curriculum.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';
import { Schema as MongooseSchema } from 'mongoose';

@InputType()
export class UpdateCourseCurriculumInput extends PartialType(
  CreateCourseCurriculumInput,
) {
  @Field(() => String)
  _id: MongooseSchema.Types.ObjectId;
}
