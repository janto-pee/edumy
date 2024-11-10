import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Prop } from '@nestjs/mongoose';

@ObjectType()
export class Skill {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
  @Prop() skillName: string;
  @Prop() skillId: string;
  @Prop() string: string;
}
