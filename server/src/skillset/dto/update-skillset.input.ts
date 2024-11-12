import { CreateSkillsetInput } from './create-skillset.input';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateSkillsetInput extends PartialType(CreateSkillsetInput) {
  @Field(() => String)
  _id: MongooseSchema.Types.ObjectId;
}
