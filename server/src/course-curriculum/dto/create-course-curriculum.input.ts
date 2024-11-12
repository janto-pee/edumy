import { InputType, Int, Field } from '@nestjs/graphql';
import { Schema as MongooseSchema } from 'mongoose';

@InputType()
export class CreateCourseCurriculumInput {
  @Field()
  subtitle_codes: string;

  @Field()
  difficulty_level: string;

  @Field()
  content_id: string;

  @Field()
  description: string;

  @Field()
  languageCode: string;

  @Field()
  instructors: string;

  @Field()
  partners: string;

  @Field()
  name: string;

  @Field()
  program: string;

  @Field()
  extraMetaData: string;

  @Field()
  clipMetaData: string;

  @Field()
  specializationMetaData: string;

  @Field()
  courseMetaData: string;

  @Field()
  contentType: string;

  @Field()
  slug: string;

  @Field()
  partner: string;
}
