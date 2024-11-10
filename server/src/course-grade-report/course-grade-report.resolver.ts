import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CourseGradeReportService } from './course-grade-report.service';
import { CourseGradeReport } from './entities/course-grade-report.entity';
import { CreateCourseGradeReportInput } from './dto/create-course-grade-report.input';
import { UpdateCourseGradeReportInput } from './dto/update-course-grade-report.input';

@Resolver(() => CourseGradeReport)
export class CourseGradeReportResolver {
  constructor(private readonly courseGradeReportService: CourseGradeReportService) {}

  @Mutation(() => CourseGradeReport)
  createCourseGradeReport(@Args('createCourseGradeReportInput') createCourseGradeReportInput: CreateCourseGradeReportInput) {
    return this.courseGradeReportService.create(createCourseGradeReportInput);
  }

  @Query(() => [CourseGradeReport], { name: 'courseGradeReport' })
  findAll() {
    return this.courseGradeReportService.findAll();
  }

  @Query(() => CourseGradeReport, { name: 'courseGradeReport' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.courseGradeReportService.findOne(id);
  }

  @Mutation(() => CourseGradeReport)
  updateCourseGradeReport(@Args('updateCourseGradeReportInput') updateCourseGradeReportInput: UpdateCourseGradeReportInput) {
    return this.courseGradeReportService.update(updateCourseGradeReportInput.id, updateCourseGradeReportInput);
  }

  @Mutation(() => CourseGradeReport)
  removeCourseGradeReport(@Args('id', { type: () => Int }) id: number) {
    return this.courseGradeReportService.remove(id);
  }
}
