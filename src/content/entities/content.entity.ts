import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, now } from 'mongoose';
import { ContentItem } from 'src/contentitem/entities/contentitem.entity';
import { User } from 'src/user/entities/user.entity';

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

  @Prop()
  @Field({ nullable: false })
  duration: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'user' })
  @Field()
  createdBy: string;

  @Field(() => User)
  creator: User;

  @Field(() => ContentItem)
  contentitem: ContentItem;

  @Prop({ default: now() })
  @Field({ nullable: false })
  createdAt: Date;
}
export const ContentSchema = SchemaFactory.createForClass(Content);
