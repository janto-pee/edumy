import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateCourseInput {
  @Field()
  subtitleCodes: string;

  @Field()
  difficultyLevel: string;

  @Field()
  contentId: string;

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
