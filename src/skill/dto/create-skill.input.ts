import { InputType, Field } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  IsNumber,
  Min,
} from 'class-validator';
import { SkillCategory, SkillLevel } from '../entities/skill.entity';

@InputType()
export class CreateSkillInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => SkillCategory, { nullable: true })
  @IsOptional()
  @IsEnum(SkillCategory)
  category?: SkillCategory;

  @Field(() => SkillLevel, { nullable: true })
  @IsOptional()
  @IsEnum(SkillLevel)
  level?: SkillLevel;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  relatedCourses?: string[];

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  icon?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  popularity?: number;

  @Field()
  createdBy: string;
}
