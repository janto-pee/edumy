import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateCourseMetaDatumInput {
  @Field()
  title: string;

  @Field()
  contentType: string;

  @Field()
  skills: string;

  @Field()
  estimatedLearningTime: string;

  @Field()
  promoPhoto: string;

  @Field()
  domainTypes: string;

  @Field()
  courseId: string;

  @Field()
  createdBy: string;
}
