import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Enrollment } from 'src/enrollment/entities/enrollment.entity';
import { Program } from 'src/program/entities/program.entity';

export type ProgramMembershipDocument = HydratedDocument<ProgramMembership>;

@Schema()
@ObjectType()
export class ProgramMembership {
  @Field(() => ID)
  _id: string;

  @Prop({
    type: { type: mongoose.Schema.Types.ObjectId, ref: Program.name },
  })
  @Field(() => Program)
  program: Program;
}
export const ProgramMembershipSchema =
  SchemaFactory.createForClass(ProgramMembership);
