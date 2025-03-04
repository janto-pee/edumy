import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateProgrammembershipInput {
  @Field()
  joinedAt: string;

  @Field()
  programId: string;

  @Field()
  externalId: string;

  @Field()
  fullName: string;

  @Field()
  email: string;
}
