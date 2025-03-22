import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { ProgramService } from './program.service';
import { Program } from './entities/program.entity';
import { CreateProgramInput } from './dto/create-program.input';
import { UpdateProgramInput } from './dto/update-program.input';
import { Course } from 'src/course/entities/course.entity';
import { CourseService } from 'src/course/course.service';

@Resolver(() => Program)
export class ProgramResolver {
  constructor(
    private readonly programService: ProgramService,
    private readonly courseService: CourseService,
  ) {}

  @Mutation(() => Program)
  async createProgram(
    @Args('createProgramInput') createProgramInput: CreateProgramInput,
  ) {
    return await this.programService.create({
      ...createProgramInput,
    });
  }

  @Query(() => [Program], { name: 'programs' })
  async findAll() {
    return await this.programService.findAll();
  }

  @Query(() => Program, { name: 'program' })
  async findOne(@Args('id', { type: () => String }) id: string) {
    return await this.programService.findOne(id);
  }

  @Mutation(() => Program)
  async updateProgram(
    @Args('updateProgramInput') updateProgramInput: UpdateProgramInput,
  ) {
    return await this.programService.update(
      updateProgramInput.id,
      updateProgramInput,
    );
  }

  @Mutation(() => Program)
  async removeProgram(@Args('id', { type: () => String }) id: string) {
    return await this.programService.remove(id);
  }

  @ResolveField()
  async course(@Parent() program: Program) {
    const { courseId } = program;
    const metadata = await this.courseService.filterBy(courseId);
    return metadata;
  }
}
