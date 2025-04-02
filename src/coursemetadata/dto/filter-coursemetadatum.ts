import { Field, InputType, Int, Float } from '@nestjs/graphql';

@InputType()
export class CourseMetaDatumFilterDto {
  @Field(() => String, { nullable: true })
  title: string;

  @Field(() => String, { nullable: true })
  contentId: string;

  @Field(() => String, { nullable: true })
  contentType: string;

  @Field(() => String, { nullable: true })
  skills: string;

  @Field(() => String, { nullable: true })
  estimatedLearningTime: string;

  @Field(() => String, { nullable: true })
  promoPhoto: string;

  @Field(() => String, { nullable: true })
  domainTypes: string;

  @Field(() => String, { nullable: true })
  sortBy?: string;

  @Field(() => String, { nullable: true })
  sortDirection?: 'asc' | 'desc';
}
