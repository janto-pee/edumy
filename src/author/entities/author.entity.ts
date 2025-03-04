import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
@ObjectType()
export class Author {
  @Field(() => ID)
  _id: string;

  @Prop()
  @Field()
  firstName?: string;

  @Prop()
  @Field()
  lastName?: string;
}

export const AuthorSchema = SchemaFactory.createForClass(Author);
