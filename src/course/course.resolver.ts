import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { CourseService } from './course.service';
import { Course } from './entities/course.entity';
import { CreateCourseInput } from './dto/create-course.input';
import { UpdateCourseInput } from './dto/update-course.input';
import { SkillService } from 'src/skill/skill.service';
import { CoursemetadataService } from 'src/coursemetadata/coursemetadata.service';
import { ContentService } from 'src/content/content.service';

@Resolver(() => Course)
export class CourseResolver {
  constructor(
    private readonly courseService: CourseService,
    private readonly skillService: SkillService,
    private readonly courseMetadataService: CoursemetadataService,
    private readonly contentService: ContentService,
  ) {}

  @Mutation(() => Course)
  async createCourse(
    @Args('createCourseInput') createCourseInput: CreateCourseInput,
  ) {
    // console.log(
    //   'create course...........',
    //   createCourseInput,
    //   'type',
    //   typeof createCourseInput.program,
    // );
    return await this.courseService.create(createCourseInput);
  }

  @Query(() => [Course], { name: 'courses' })
  async findAll() {
    return await this.courseService.findAll();
  }

  @Query(() => Course, { name: 'course' })
  async findOne(@Args('id', { type: () => String }) id: string) {
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
  async removeCourse(@Args('id', { type: () => String }) id: string) {
    return await this.courseService.remove(id);
  }

  /**
   * RESOLVER
   */
  @ResolveField()
  async skills(@Parent() course: Course) {
    const { skillId } = course;
    const skill = await this.skillService.findOne(skillId);

    return skill;
  }

  @ResolveField()
  async content(@Parent() course: Course) {
    const { contentId } = course;
    const content = await this.contentService.findOne(contentId);
    return content;
  }

  @ResolveField()
  async courseMetada(@Parent() course: Course) {
    const { coursseMetadatId } = course;
    const metadata = await this.courseMetadataService.findOne(coursseMetadatId);
    return metadata;
  }
}
