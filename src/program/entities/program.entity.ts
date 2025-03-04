import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Course } from 'src/course/entities/course.entity';
// import { Instructor } from 'src/instructor/entities/instructor.entity';

export type ProgramDocument = HydratedDocument<Program>;

@ObjectType()
@Schema()
export class Program {
  @Field(() => ID)
  _id: MongooseSchema.Types.ObjectId;

  @Prop({
    type: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  })
  @Field(() => [Course])
  courseId: Course;

  @Prop()
  name: string;

  @Prop()
  tagline: string;

  @Prop()
  url: string;

  @Prop()
  contentId: string;

  @Prop()
  contentType: string;
}
export const ProgramSchema = SchemaFactory.createForClass(Program);
