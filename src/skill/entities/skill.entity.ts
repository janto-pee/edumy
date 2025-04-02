import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from 'src/user/entities/user.entity';

export enum SkillLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  EXPERT = 'EXPERT',
}

registerEnumType(SkillLevel, {
  name: 'SkillLevel',
  description: 'Skill proficiency levels',
});

export enum SkillCategory {
  TECHNICAL = 'TECHNICAL',
  SOFT = 'SOFT',
  LANGUAGE = 'LANGUAGE',
  BUSINESS = 'BUSINESS',
  CREATIVE = 'CREATIVE',
  OTHER = 'OTHER',
}

registerEnumType(SkillCategory, {
  name: 'SkillCategory',
  description: 'Skill categories',
});

@Schema({ timestamps: true })
@ObjectType()
export class Skill extends Document {
  @Field(() => ID)
  declare _id: string;

  @Prop({ required: true })
  @Field()
  name: string;

  @Prop()
  @Field({ nullable: true })
  description: string;

  @Prop({ enum: SkillCategory, type: String, default: SkillCategory.OTHER })
  @Field(() => SkillCategory)
  category: SkillCategory;

  @Prop({ enum: SkillLevel, type: String, default: SkillLevel.BEGINNER })
  @Field(() => SkillLevel)
  level: SkillLevel;

  @Prop({ default: [] })
  @Field(() => [String], { nullable: true })
  tags: string[];

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Course' }] })
  @Field(() => [String], { nullable: true })
  relatedCourses: string[];

  @Prop()
  @Field({ nullable: true })
  icon: string;

  @Prop({ default: 0 })
  @Field()
  popularity: number;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  @Field({ nullable: true })
  createdBy: string;

  @Field(() => User)
  creator: User;

  @Prop({ default: Date.now })
  @Field()
  createdAt: Date;

  @Prop({ default: Date.now })
  @Field()
  updatedAt: Date;
}

export const SkillSchema = SchemaFactory.createForClass(Skill);

// Indexes for faster queries
SkillSchema.index({ name: 1 });
SkillSchema.index({ category: 1 });
SkillSchema.index({ tags: 1 });
SkillSchema.index({ popularity: -1 });
