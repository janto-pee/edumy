import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type SkillDocument = HydratedDocument<Skill>;

@ObjectType()
@Schema()
export class Skill {
  @Field(() => ID, { description: 'id of session' })
  _id: MongooseSchema.Types.ObjectId;

  @Field()
  @Prop()
  skillName: string;

  @Field()
  @Prop()
  skillId: string;
}
export const SkillSchema = SchemaFactory.createForClass(Skill);
