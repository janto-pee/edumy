import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CourseService } from './course.service';
import { Course } from './entities/course.entity';
import { CreateCourseInput } from './dto/create-course.input';
import { UpdateCourseInput } from './dto/update-course.input';
import { Schema as MongooseSchema } from 'mongoose';

@Resolver(() => Course)
export class CourseResolver {
  constructor(private readonly courseService: CourseService) {}

  @Mutation(() => Course)
  createCourse(
    @Args('createCourseInput') createCourseInput: CreateCourseInput,
  ) {
    return this.courseService.create(createCourseInput);
  }

  @Query(() => [Course], { name: 'course' })
  async findCourses() {
    return await this.courseService.findAll();
  }

  @Query(() => Course, { name: 'course' })
  async findOne(
    @Args('id', { type: () => String }) id: MongooseSchema.Types.ObjectId,
  ) {
    return await this.courseService.findOne(id);
  }

  @Mutation(() => Course)
  async updateCourse(
    @Args('updateCourseInput') updateCourseInput: UpdateCourseInput,
  ) {
    return await this.courseService.update(
      updateCourseInput._id,
      updateCourseInput,
    );
  }

  @Mutation(() => Course)
  async removeCourse(
    @Args('id', { type: () => String }) id: MongooseSchema.Types.ObjectId,
  ) {
    return await this.courseService.remove(id);
  }
}
