import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Prop } from '@nestjs/mongoose';

@ObjectType()
export class EnrollmentState {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;

  @Prop()
  contentId: string;

  @Prop()
  externalId: string;

  @Prop()
  state: string;

  @Prop()
  id: string;

  @Prop()
  contentType: string;
}
