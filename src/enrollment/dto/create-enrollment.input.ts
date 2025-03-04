import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateEnrollmentInput {
  @Field()
  title: string;

  @Field()
  contentType: string;
}
