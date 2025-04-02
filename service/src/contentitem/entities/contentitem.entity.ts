import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Content } from 'src/content/entities/content.entity';
// import { Content } from 'src/content/entities/content.entity';

@Schema()
@ObjectType()
export class Contentitem {
  @Field(() => ID)
  _id: string;

  @Prop()
  @Field({ nullable: false })
  title: string;

  @Prop()
  @Field({ nullable: false })
  contentType: string;

  @Prop()
  @Field({ nullable: false })
  reference: string;

  @Prop()
  @Field({ nullable: false })
  contentDuration: string;

  @Prop({ type: { type: mongoose.Schema.Types.ObjectId, ref: 'Content' } })
  @Field()
  contentId: string;

  @Field(() => Content)
  content: Content;
}
export const ContentitemSchema = SchemaFactory.createForClass(Contentitem);
