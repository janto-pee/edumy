import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Schema as MongooseSchema } from 'mongoose';
// import { Student } from 'src/student/entities/student.entity';

@ObjectType()
@Schema()
export class ProgramMembership {
  @Field(() => ID)
  _id: MongooseSchema.Types.ObjectId;

  // @Prop({
  //   type: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  // })
  // @Field(() => [Student])
  // StudenId: Student;

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
