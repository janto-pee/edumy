import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@ObjectType()
@Schema()
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
export const InstructorSchema = SchemaFactory.createForClass(Instructor);
