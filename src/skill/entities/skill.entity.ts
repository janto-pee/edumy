import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Schema as MongooseSchema } from 'mongoose';
import { Course } from 'src/course/entities/course.entity';

@Schema()
@ObjectType()
export class Skill {
  @Field(() => ID, { description: 'id of session' })
  _id: string;

  @Prop()
  @Field()
  skillName: string;

  @Prop()
  @Field()
  skillId: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Course' })
  @Field({ nullable: false })
  courseId: string;

  @Field(() => Course)
  course: Course;
}
export const SkillSchema = SchemaFactory.createForClass(Skill);
