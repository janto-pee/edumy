import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Prop } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/user/entities/user.entity';

@ObjectType()
export class Session {
  @Field(() => ID)
  _id: number;

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
