import { CreateSkillInput } from './create-skill.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

@InputType()
export class UpdateSkillInput extends PartialType(CreateSkillInput) {
  @Field(() => String)
  _id: MongooseSchema.Types.ObjectId;
}
