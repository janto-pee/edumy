import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateSessionInput {
  @Field()
  email: string;

  @Field()
  password: string;
}
