import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateCoursemetadatumInput {
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
}
