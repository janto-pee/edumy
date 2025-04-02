import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
// import mongoose from 'mongoose';
import { Course } from 'src/course/entities/course.entity';
import { User } from 'src/user/entities/user.entity';

@Schema()
@ObjectType()
export class Program {
  @Field(() => ID)
  _id: string;

  @Prop()
  @Field()
  title: string;

  @Prop()
  @Field()
  tagline: string;

  @Prop()
  @Field()
  url: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'user' })
  @Field()
  createdBy: string;

  // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Course' })
  // @Field({ nullable: false })
  // courseId: string;

  @Field(() => User)
  creator: User;

  @Field(() => [Course])
  courses: Course[];
}
export const ProgramSchema = SchemaFactory.createForClass(Program);
