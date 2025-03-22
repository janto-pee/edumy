import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Enrollment } from 'src/enrollment/entities/enrollment.entity';
import { Program } from 'src/program/entities/program.entity';
import { User } from 'src/user/entities/user.entity';

export type ProgramMembershipDocument = HydratedDocument<ProgramMembership>;

@Schema()
@ObjectType()
export class ProgramMembership {
  @Field(() => ID)
  _id: string;

  @Prop({
    type: { type: mongoose.Schema.Types.ObjectId, ref: Program.name },
  })
  @Field()
  program: string;

  @Prop({
    type: { type: mongoose.Schema.Types.ObjectId, ref: User.name },
  })
  @Field()
  user: string;

  @Field(() => [User])
  User: User[];
}
export const ProgramMembershipSchema =
  SchemaFactory.createForClass(ProgramMembership);
