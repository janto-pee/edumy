import { Field, InputType, Int, Float } from '@nestjs/graphql';

@InputType()
export class SkillFilterDto {
  @Field(() => String, { nullable: true })
  name: string;

  @Field(() => String, { nullable: true })
  description: string;

  @Field(() => String, { nullable: true })
  category: string;

  @Field(() => String, { nullable: true })
  level: string;

  @Field(() => String, { nullable: true })
  tags: string[];

  @Field(() => String, { nullable: true })
  relatedCourses: string[];

  @Field(() => String, { nullable: true })
  icon: string;

  @Field(() => String, { nullable: true })
  popularity: number;

  @Field(() => String, { nullable: true })
  sortBy?: string;

  @Field(() => String, { nullable: true })
  sortDirection?: 'asc' | 'desc';
}
