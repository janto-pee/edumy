import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@ObjectType()
@Schema()
export class Program {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
  @Prop()
  id: string;

  @Prop()
  name: string;

  @Prop()
  tagline: string;

  @Prop()
  url: string;

  @Prop()
  contentIds: string;

  @Prop()
  contentId: string;

  @Prop()
  contentType: string;
}
export const ProgramSchema = SchemaFactory.createForClass(Program);
