import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateContentInput {
  @Field()
  title: string;

  @Field()
  text: string;

  @Field()
  content: string;

  @Field()
  duration: string;

  @Field()
  contentItemId: string;

  @Field()
  courseId: string;

  @Field()
  createdBy: string;
}
