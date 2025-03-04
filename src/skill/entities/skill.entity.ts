import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';

@Schema()
@ObjectType()
export class Skill {
  @Field(() => ID, { description: 'id of session' })
  _id: string;

  @Prop()
  @Field()
  skillName: string;

  @Prop()
  @Field()
  skillId: string;
}
export const SkillSchema = SchemaFactory.createForClass(Skill);
