import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Content } from 'src/content/entities/content.entity';

export type ContentitemDocument = HydratedDocument<Contentitem>;

@ObjectType()
@Schema()
export class Contentitem {
  @Field(() => ID)
  _id: MongooseSchema.Types.ObjectId;

  @Prop({
    type: { type: mongoose.Schema.Types.ObjectId, ref: 'Content' },
  })
  @Field(() => [Content])
  content: Content;

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

  // @Prop()
  // @Field({ nullable: false })
  // createdAt: Date;
}
export const ContentitemSchema = SchemaFactory.createForClass(Contentitem);
