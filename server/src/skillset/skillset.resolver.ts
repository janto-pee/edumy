import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { SkillsetService } from './skillset.service';
import { Skillset } from './entities/skillset.entity';
import { CreateSkillsetInput } from './dto/create-skillset.input';
import { UpdateSkillsetInput } from './dto/update-skillset.input';
import { Schema as MongooseSchema } from 'mongoose';

@Resolver(() => Skillset)
export class SkillsetResolver {
  constructor(private readonly skillsetService: SkillsetService) {}

  @Mutation(() => Skillset)
  createSkillset(
    @Args('createSkillsetInput') createSkillsetInput: CreateSkillsetInput,
  ) {
    return this.skillsetService.create(createSkillsetInput);
  }

  @Query(() => [Skillset], { name: 'skillset' })
  findAll() {
    return this.skillsetService.findAll();
  }

  @Query(() => Skillset, { name: 'skillset' })
  findOne(
    @Args('id', { type: () => String }) id: MongooseSchema.Types.ObjectId,
  ) {
    return this.skillsetService.findOne(id);
  }

  @Mutation(() => Skillset)
  updateSkillset(
    @Args('updateSkillsetInput') updateSkillsetInput: UpdateSkillsetInput,
  ) {
    return this.skillsetService.update(
      updateSkillsetInput._id,
      updateSkillsetInput,
    );
  }

  @Mutation(() => Skillset)
  removeSkillset(
    @Args('id', { type: () => String }) id: MongooseSchema.Types.ObjectId,
  ) {
    return this.skillsetService.remove(id);
  }
}
