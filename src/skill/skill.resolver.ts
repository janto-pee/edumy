import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { SkillService } from './skill.service';
import { Skill } from './entities/skill.entity';
import { CreateSkillInput } from './dto/create-skill.input';
import { UpdateSkillInput } from './dto/update-skill.input';
import { CourseService } from 'src/course/course.service';

@Resolver(() => Skill)
export class SkillResolver {
  constructor(
    private readonly skillService: SkillService,
    private readonly courseService: CourseService,
  ) {}

  @Mutation(() => Skill)
  async createSkill(
    @Args('createSkillInput') createSkillInput: CreateSkillInput,
  ) {
    return await this.skillService.create(createSkillInput);
  }

  @Query(() => [Skill], { name: 'skills' })
  async findAll() {
    return await this.skillService.findAll();
  }

  @Query(() => Skill, { name: 'skill' })
  async findOne(@Args('id', { type: () => String }) id: string) {
    return await this.skillService.findOne(id);
  }

  @Mutation(() => Skill)
  async updateSkill(
    @Args('updateSkillInput') updateSkillInput: UpdateSkillInput,
  ) {
    return await this.skillService.update(
      updateSkillInput.id,
      updateSkillInput,
    );
  }

  @Mutation(() => Skill)
  async removeSkill(@Args('id', { type: () => String }) id: string) {
    return await this.skillService.remove(id);
  }

  @ResolveField()
  async course(@Parent() skill: Skill) {
    const { courseId } = skill;
    const skills = await this.courseService.filterBy(courseId);
    return skills;
  }
}
