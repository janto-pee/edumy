import { CreateCourseGradeReportInput } from './create-course-grade-report.input';
import { Schema as MongooseSchema } from 'mongoose';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateCourseGradeReportInput extends PartialType(
  CreateCourseGradeReportInput,
) {
  @Field(() => String)
  _id: MongooseSchema.Types.ObjectId;
}
