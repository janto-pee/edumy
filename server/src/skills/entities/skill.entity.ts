import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Prop, SchemaFactory } from '@nestjs/mongoose';

@ObjectType()
export class Skill {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;

  @Field()
  @Prop()
  skillName: string;

  @Field()
  @Prop()
  skillId: string;
}
export const SkillSchema = SchemaFactory.createForClass(Skill);
