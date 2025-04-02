import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
  Int,
} from '@nestjs/graphql';
import { GqlAuthGuard } from 'src/auth/gqll-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Subscription } from '@nestjs/graphql';
import { Inject, Logger, UseGuards } from '@nestjs/common';
import { SkillService } from 'src/skill/skill.service';
import { Skill } from './entities/skill.entity';
import { CreateSkillInput } from './dto/create-skill.input';
import {
  UpdateBulkSkillInput,
  UpdateSkillInput,
} from './dto/update-skill.input';
import { ContentService } from 'src/content/content.service';
import { SkillPaginationResponse } from './dto/pagination-response';
import { SkillFilterDto } from './dto/filter-coursemetadatum';
import { RolesGuard } from 'src/auth/role.gurad';
import { PubSub } from 'graphql-subscriptions';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { User } from 'src/user/entities/user.entity';

@Resolver(() => Skill)
export class SkillResolver {
  private readonly logger = new Logger(SkillResolver.name);

  constructor(
    private readonly skillService: SkillService,
    @Inject('PUB_SUB') private pubSub: PubSub,
  ) {}

  @Mutation(() => Skill)
  @UseGuards(GqlAuthGuard)
  async createSkill(
    @Args('createSkillInput') createSkillInput: CreateSkillInput,
    @CurrentUser() user: User,
  ) {
    try {
      const Skill = await this.skillService.create({
        ...createSkillInput,
        createdBy: user._id,
      });
      this.pubSub.publish('skillCreated', { skillCreated: Skill });
      return Skill;
    } catch (error) {
      this.logger.error(
        `Failed to create Skill: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Query(() => SkillPaginationResponse, { name: 'skills' })
  async findAll(
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
  ) {
    try {
      return await this.skillService.findAll(page, limit);
    } catch (error) {
      this.logger.error(
        `Failed to fetch skills: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Query(() => SkillPaginationResponse, { name: 'filteredSkills' })
  async findWithFilters(
    @Args('filter') filter: SkillFilterDto,
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
  ) {
    try {
      return await this.skillService.findWithFilters(filter, page, limit);
    } catch (error) {
      this.logger.error(
        `Failed to fetch filtered skills: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Query(() => Skill, { name: 'Skill' })
  async findOne(@Args('id', { type: () => String }) id: string) {
    try {
      return await this.skillService.findOne(id);
    } catch (error) {
      this.logger.error(
        `Failed to fetch Skill with id ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Query(() => [Skill], { name: 'searchSkills' })
  async searchSkills(
    @Args('searchTerm', { type: () => String }) searchTerm: string,
  ) {
    try {
      return await this.skillService.searchSkills(searchTerm);
    } catch (error) {
      this.logger.error(
        `Failed to search skills with term '${searchTerm}': ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  // @Query(() => Object, { name: 'skillStatistics' })
  // @UseGuards(GqlAuthGuard, RolesGuard)
  // @Roles('ADMIN', 'INSTRUCTOR')
  // async getSkillStatistics() {
  //   try {
  //     return await this.skillService.getSkillStatistics();
  //   } catch (error) {
  //     this.logger.error(
  //       `Failed to get Skill statistics: ${error.message}`,
  //       error.stack,
  //     );
  //     throw error;
  //   }
  // }

  @Mutation(() => Skill)
  @UseGuards(GqlAuthGuard)
  async updateSkill(
    @Args('updateSkillInput') updateSkillInput: UpdateSkillInput,
    @CurrentUser() user: User,
  ) {
    try {
      const Skill = await this.skillService.update(
        updateSkillInput.id,
        updateSkillInput,
      );
      this.pubSub.publish('skillUpdated', { skillUpdated: Skill });
      return Skill;
    } catch (error) {
      this.logger.error(
        `Failed to update Skill: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Mutation(() => [Skill])
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN', 'INSTRUCTOR')
  async createManySkills(
    @Args('createSkillInputs', { type: () => [CreateSkillInput] })
    createSkillInputs: CreateSkillInput[],
    @CurrentUser() user: User,
  ) {
    try {
      const skillsWithCreator = createSkillInputs.map((input) => ({
        ...input,
        createdBy: user._id,
      }));
      return await this.skillService.createMany(skillsWithCreator);
    } catch (error) {
      this.logger.error(
        `Failed to create multiple skills: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Mutation(() => Int)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN', 'INSTRUCTOR')
  async updateManySkills(
    @Args('updates', { type: () => [UpdateBulkSkillInput] })
    updates: { id: string; data: Partial<UpdateSkillInput> }[],
  ) {
    try {
      return await this.skillService.updateMany(updates);
    } catch (error) {
      this.logger.error(
        `Failed to update multiple skills: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Mutation(() => Skill)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async removeSkill(@Args('id', { type: () => String }) id: string) {
    try {
      const Skill = await this.skillService.remove(id);
      this.pubSub.publish('skillDeleted', { skillDeleted: Skill });
      return Skill;
    } catch (error) {
      this.logger.error(
        `Failed to remove Skill with id ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async bulkDeleteSkills(@Args('ids', { type: () => [String] }) ids: string[]) {
    try {
      const result = await this.skillService.bulkDelete(ids);
      return result;
    } catch (error) {
      this.logger.error(
        `Failed to bulk delete skills: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Query(() => [Skill], { name: 'popularSkills' })
  async getPopularSkills(
    @Args('limit', { type: () => Int, defaultValue: 5 }) limit: number,
  ) {
    try {
      return await this.skillService.getPopularSkills(limit);
    } catch (error) {
      this.logger.error(
        `Failed to fetch popular skills: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Query(() => [Skill], { name: 'recentSkills' })
  async getRecentSkills(
    @Args('limit', { type: () => Int, defaultValue: 5 }) limit: number,
  ) {
    try {
      return await this.skillService.getRecentSkills(limit);
    } catch (error) {
      this.logger.error(
        `Failed to fetch recent skills: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * RESOLVER FIELDS
   */

  @ResolveField()
  async creator(@Parent() Skill: Skill) {
    try {
      const { createdBy } = Skill;
      if (!createdBy) return null;
      // Assuming you have a user service to fetch user details
      // return await this.userService.findOne(createdBy);
      return null; // Replace with actual implementation
    } catch (error) {
      this.logger.error(
        `Failed to resolve creator for Skill: ${error.message}`,
        error.stack,
      );
      return null;
    }
  }

  /**
   * Subscriptions
   * for real time updates
   */
  @Subscription(() => Skill)
  skillCreated() {
    return this.pubSub.asyncIterableIterator('skillCreated');
  }

  @Subscription(() => Skill)
  skillUpdated() {
    return this.pubSub.asyncIterableIterator('skillUpdated');
  }

  @Subscription(() => Skill)
  skillDeleted() {
    return this.pubSub.asyncIterableIterator('skillDeleted');
  }
}
