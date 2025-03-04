import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Schema as MongooseSchema } from 'mongoose';
import { Course } from 'src/course/entities/course.entity';

@ObjectType()
@Schema()
export class Coursemetada {
  @Field(() => ID)
  _id: MongooseSchema.Types.ObjectId;

  @Prop({
    type: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  })
  @Field(() => [Course])
  courseId: Course;

  @Prop()
  @Field({ nullable: false })
  title: string;

  @Prop()
  @Field({ nullable: false })
  contentType: string;

  @Prop()
  skills: string;

  @Prop()
  estimatedLearningTime: string;

  @Prop()
  promoPhoto: string;

  @Prop()
  domainTypes: string;
}
export const CoursemetadaSchema = SchemaFactory.createForClass(Coursemetada);
