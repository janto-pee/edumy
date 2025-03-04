import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
@ObjectType()
export class Course {
  @Field(() => ID)
  _id: string;

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
