import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateContentitemInput {
  @Field()
  title: string;

  @Field()
  contentType: string;

  @Field()
  contentId: string;

  @Field()
  reference: string;

  @Field()
  contentDuration: string;
}
