import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Content } from 'src/content/entities/content.entity';
import { User } from 'src/user/entities/user.entity';
// import { Content } from 'src/content/entities/content.entity';

@Schema()
@ObjectType()
export class ContentItem {
  @Field(() => ID)
  id: string;

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

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'user' })
  @Field()
  createdBy: string;

  @Field(() => User)
  creator: User;
}
export const ContentItemSchema = SchemaFactory.createForClass(ContentItem);
