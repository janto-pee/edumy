import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Prop } from '@nestjs/mongoose';

@ObjectType()
export class Instructor {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
  @Prop()
  id: string;

  @Prop()
  photoURL: string;

  @Prop()
  name: string;

  @Prop()
  title: string;

  @Prop()
  department: string;
}
