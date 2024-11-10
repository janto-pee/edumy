import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ItemGradeService } from './item-grade.service';
import { ItemGrade } from './entities/item-grade.entity';
import { CreateItemGradeInput } from './dto/create-item-grade.input';
import { UpdateItemGradeInput } from './dto/update-item-grade.input';

@Resolver(() => ItemGrade)
export class ItemGradeResolver {
  constructor(private readonly itemGradeService: ItemGradeService) {}

  @Mutation(() => ItemGrade)
  createItemGrade(@Args('createItemGradeInput') createItemGradeInput: CreateItemGradeInput) {
    return this.itemGradeService.create(createItemGradeInput);
  }

  @Query(() => [ItemGrade], { name: 'itemGrade' })
  findAll() {
    return this.itemGradeService.findAll();
  }

  @Query(() => ItemGrade, { name: 'itemGrade' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.itemGradeService.findOne(id);
  }

  @Mutation(() => ItemGrade)
  updateItemGrade(@Args('updateItemGradeInput') updateItemGradeInput: UpdateItemGradeInput) {
    return this.itemGradeService.update(updateItemGradeInput.id, updateItemGradeInput);
  }

  @Mutation(() => ItemGrade)
  removeItemGrade(@Args('id', { type: () => Int }) id: number) {
    return this.itemGradeService.remove(id);
  }
}
