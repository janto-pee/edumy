import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Schema as MongooseSchema } from 'mongoose';

import { Course } from 'src/course/entities/course.entity';
@ObjectType()
@Schema()
export class Enrollment {
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
}
export const EnrollmentSchema = SchemaFactory.createForClass(Enrollment);
