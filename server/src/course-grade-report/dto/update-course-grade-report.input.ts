import { CreateCourseGradeReportInput } from './create-course-grade-report.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateCourseGradeReportInput extends PartialType(CreateCourseGradeReportInput) {
  @Field(() => Int)
  id: number;
}
