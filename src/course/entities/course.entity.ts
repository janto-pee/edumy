import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Content } from 'src/content/entities/content.entity';
import { Coursemetada } from 'src/coursemetadata/entities/coursemetadatum.entity';
import { Skill } from 'src/skill/entities/skill.entity';

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
  extraMetaData: string;

  @Prop()
  @Field()
  clipMetaData: string;

  @Prop()
  @Field()
  specializationMetaData: string;

  @Prop()
  @Field()
  contentType: string;

  @Prop()
  @Field()
  slug: string;

  @Prop()
  @Field()
  partner: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'skill' })
  @Field()
  skillId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'content' })
  @Field({ nullable: false })
  contentId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'courssemetada' })
  @Field({ nullable: false })
  coursseMetadatId: string;

  @Field(() => Coursemetada)
  courseMetada: Coursemetada;

  @Field(() => Content)
  content: Content;

  @Field(() => [Skill])
  skills: Skill[];
}

export const CourseSchema = SchemaFactory.createForClass(Course);
