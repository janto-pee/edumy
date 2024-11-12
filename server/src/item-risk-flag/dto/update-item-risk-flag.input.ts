import { CreateItemRiskFlagInput } from './create-item-risk-flag.input';
import { Schema as MongooseSchema } from 'mongoose';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateItemRiskFlagInput extends PartialType(
  CreateItemRiskFlagInput,
) {
  @Field(() => String)
  _id: MongooseSchema.Types.ObjectId;
}
