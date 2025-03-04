import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateContentitemInput {
  // @Field()
  // coursecontent: Coursecontent;

  @Field()
  title: string;

  @Field()
  contentType: string;

  @Field()
  reference: string;

  @Field()
  contentDuration: string;
}
