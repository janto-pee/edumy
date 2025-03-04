import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

@Schema()
@ObjectType()
export class ProgramMembership {
  @Field(() => ID)
  _id: string;

  // @Prop({
  //   type: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  // })
  // @Field(() => [Student])
  // StudenId: Student;

  @Prop()
  @Field()
  joinedAt: string;

  @Prop()
  @Field()
  programId: string;

  @Prop()
  @Field()
  externalId: string;

  @Prop()
  @Field()
  fullName: string;

  @Prop()
  @Field()
  email: string;
}
export const ProgramMembershipSchema =
  SchemaFactory.createForClass(ProgramMembership);
