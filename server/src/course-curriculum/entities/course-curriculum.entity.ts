import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Prop } from '@nestjs/mongoose';

@ObjectType()
export class CourseCurriculum {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;

  @Prop()
  subtitle_codes: string;

  @Prop()
  difficulty_level: string;

  @Prop()
  content_id: string;

  @Prop()
  description: string;

  @Prop()
  languageCode: string;

  @Prop()
  instructors: string;

  @Prop()
  partners: string;

  @Prop()
  name: string;

  @Prop()
  program: string;

  @Prop()
  extraMetaData: string;

  @Prop()
  clipMetaData: string;

  @Prop()
  specializationMetaData: string;

  @Prop()
  courseMetaData: string;

  @Prop()
  contentType: string;

  @Prop()
  slug: string;

  @Prop()
  partner: string;
}
