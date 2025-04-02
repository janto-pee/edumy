import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateProgramInput {
  @Field()
  title: string;

  @Field()
  tagline: string;

  @Field()
  url: string;

  @Field()
  createdBy: string;

  // @Field()
  // contentId: string;

  // @Field()
  // contentType: string;
}
