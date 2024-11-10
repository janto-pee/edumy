import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Prop } from '@nestjs/mongoose';

@ObjectType()
export class CourseMaterial {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
  @Prop() id: string;
  @Prop() module: string;
}
