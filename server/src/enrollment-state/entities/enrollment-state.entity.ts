import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@ObjectType()
@Schema()
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
export const EnrollmentStateSchema =
  SchemaFactory.createForClass(EnrollmentState);
