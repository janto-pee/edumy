import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type CourseCurriculumDocument = HydratedDocument<CourseCurriculum>;

@ObjectType()
@Schema()
export class CourseCurriculum {
  @Field(() => ID)
  _id: MongooseSchema.Types.ObjectId;

  @Prop()
  @Field()
  subtitle_codes: string;

  @Prop()
  @Field()
  difficulty_level: string;

  @Prop()
  @Field()
  content_id: string;

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
  @Field()
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
export const CourseCurriculumSchema =
  SchemaFactory.createForClass(CourseCurriculum);
