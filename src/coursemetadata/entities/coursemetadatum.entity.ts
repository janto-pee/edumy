import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Schema as MongooseSchema } from 'mongoose';
// import { Course } from 'src/course/entities/course.entity';

@Schema()
@ObjectType()
export class Coursemetada {
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
}
export const CoursemetadaSchema = SchemaFactory.createForClass(Coursemetada);
