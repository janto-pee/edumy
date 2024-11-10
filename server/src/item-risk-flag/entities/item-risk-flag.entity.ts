import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Prop } from '@nestjs/mongoose';

@ObjectType()
export class ItemRiskFlag {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
  @Prop()
  id: string;

  @Prop()
  CONFIRMED_PLAGIARISM: boolean;

  @Prop()
  SUSPECTED_PLAGIARISM: boolean;

  @Prop()
  FAILED_ASSIGNMENT: boolean;
}
