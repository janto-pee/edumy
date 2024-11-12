import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type SkillDocument = HydratedDocument<Skill>;

@ObjectType()
@Schema()
export class Skill {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  _id: MongooseSchema.Types.ObjectId;

  @Field()
  @Prop()
  skillName: string;

  @Field()
  @Prop()
  skillId: string;
}
export const SkillSchema = SchemaFactory.createForClass(Skill);
