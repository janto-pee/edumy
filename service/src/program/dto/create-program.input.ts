import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateProgramInput {
  @Field()
  name: string;

  @Field()
  tagline: string;

  @Field()
  url: string;

  // @Field()
  // contentId: string;

  // @Field()
  // contentType: string;
}
