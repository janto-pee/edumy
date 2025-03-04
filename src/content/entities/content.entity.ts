import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Course } from 'src/course/entities/course.entity';

export type ContentDocument = HydratedDocument<Content>;

@ObjectType()
@Schema()
export class Content {
  @Field(() => ID)
  _id: MongooseSchema.Types.ObjectId;

  @Prop({ type: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' } })
  @Field(() => [Course])
  courseId: Course;

  @Prop()
  @Field({ nullable: false })
  title: string;

  @Prop()
  @Field({ nullable: false })
  text: string;

  @Prop()
  @Field({ nullable: false })
  content: string;
  // content: [{}];

  @Prop()
  @Field({ nullable: false })
  duration: string;

  @Prop()
  @Field({ nullable: false })
  createdAt: Date;
}
export const ContentSchema = SchemaFactory.createForClass(Content);
