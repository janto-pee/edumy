import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/user/entities/user.entity';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

@ObjectType()
export class Session {
  @Field(() => String)
  _id: MongooseSchema.Types.ObjectId;

  @Prop({ type: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } })
  @Field(() => [User])
  userId: User;

  @Prop({ required: true, unique: true })
  @Field()
  userAgent: string;

  @Prop({ required: true, unique: true })
  @Field()
  valid: string;
}
export const SessionSchema = SchemaFactory.createForClass(Session);
