import { CreateItemGradeInput } from './create-item-grade.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateItemGradeInput extends PartialType(CreateItemGradeInput) {
  @Field(() => Int)
  id: number;
}
