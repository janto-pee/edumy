import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type CourseDocument = HydratedDocument<Course>;

@ObjectType()
@Schema()
export class Course {
  @Field(() => ID)
  _id: MongooseSchema.Types.ObjectId;

  @Prop()
  @Field({ nullable: false })
  subtitleCodes: string;

  @Prop()
  @Field()
  difficultyLevel: string;

  @Prop()
  @Field({ nullable: false })
  contentId: string;

  @Prop()
  @Field()
  description: string;

  @Prop()
  @Field()
  languageCode: string;

  @Prop()
  @Field()
  instructors: string;

  @Prop()
  @Field()
  partners: string;

  @Prop()
  @Field({ nullable: false })
  name: string;

  @Prop()
  @Field()
  program: string;

  @Prop()
  @Field()
  extraMetaData: string;

  @Prop()
  @Field()
  clipMetaData: string;

  @Prop()
  @Field()
  specializationMetaData: string;

  @Prop()
  @Field()
  courseMetaData: string;

  @Prop()
  @Field()
  contentType: string;

  @Prop()
  @Field()
  slug: string;

  @Prop()
  @Field()
  partner: string;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
