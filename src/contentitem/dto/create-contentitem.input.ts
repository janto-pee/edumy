import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateContentItemInput {
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

  @Field()
  createdBy: string;
}
