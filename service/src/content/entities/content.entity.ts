import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, now } from 'mongoose';
import { Contentitem } from 'src/contentitem/entities/contentitem.entity';

export type ContentDocument = HydratedDocument<Content>;

@Schema()
@ObjectType()
export class Content {
  @Field(() => ID)
  _id: string;

  @Prop()
  @Field({ nullable: false })
  title: string;

  @Prop()
  @Field({ nullable: false })
  text: string;

  @Prop()
  @Field({ nullable: false })
  content: string;

  @Prop({ type: { type: mongoose.Schema.Types.ObjectId, ref: 'Contentitem' } })
  @Field()
  contentItemId: string;

  @Field(() => Contentitem)
  contentitem: Contentitem;

  @Prop()
  @Field({ nullable: false })
  duration: string;

  @Prop({ default: now() })
  @Field({ nullable: false })
  createdAt: Date;
}
export const ContentSchema = SchemaFactory.createForClass(Content);
