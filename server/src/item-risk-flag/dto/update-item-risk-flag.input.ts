import { CreateItemRiskFlagInput } from './create-item-risk-flag.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateItemRiskFlagInput extends PartialType(CreateItemRiskFlagInput) {
  @Field(() => Int)
  id: number;
}
