import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Prop } from '@nestjs/mongoose';

@ObjectType()
export class ProgramMembership {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
  @Prop()
  joinedAt: string;

  @Prop()
  id: string;

  @Prop()
  programId: string;

  @Prop()
  externalId: string;

  @Prop()
  fullName: string;

  @Prop()
  email: string;
}
