import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateProgrammembershipInput {
  @Field()
  program: string;

  //   @Field()
  //   enrollmentId: string;
}
