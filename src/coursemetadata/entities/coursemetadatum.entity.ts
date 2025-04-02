import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/user/entities/user.entity';

@Schema()
@ObjectType()
export class CourseMetaDatum {
  @Field(() => ID)
  _id: string;

  // @Prop({
  //   type: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  // })
  // @Field(() => [Course])
  // courseId: Course;

  @Prop()
  @Field({ nullable: false })
  title: string;

  @Field()
  contentId: string;

  @Prop()
  @Field({ nullable: false })
  contentType: string;

  @Prop()
  @Field()
  skills: string;

  @Prop()
  @Field()
  estimatedLearningTime: string;

  @Prop()
  @Field()
  promoPhoto: string;

  @Prop()
  @Field()
  domainTypes: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'user' })
  @Field()
  createdBy: string;

  @Field(() => User)
  creator: User;
}
export const CourseMetaDatumSchema =
  SchemaFactory.createForClass(CourseMetaDatum);
