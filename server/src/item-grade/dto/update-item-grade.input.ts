import { CreateItemGradeInput } from './create-item-grade.input';
import { Schema as MongooseSchema } from 'mongoose';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateItemGradeInput extends PartialType(CreateItemGradeInput) {
  @Field(() => String)
  _id: MongooseSchema.Types.ObjectId;
}
