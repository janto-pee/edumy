import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

@ObjectType()
export class ProgramMembership {
  @Field(() => ID)
  _id: MongooseSchema.Types.ObjectId;

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
export const ProgramMembershipSchema =
  SchemaFactory.createForClass(ProgramMembership);
