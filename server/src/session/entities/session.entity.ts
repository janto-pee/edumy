import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Session {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
