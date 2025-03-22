import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now } from 'mongoose';
import { Address } from 'src/address/entities/address.entity';

@Schema()
@ObjectType()
export class User {
  @Field(() => ID)
  _id: string;

  @Prop({ unique: true })
  @Field()
  username: string;

  @Prop({ unique: true })
  @Field()
  email: string;

  @Prop()
  @Field()
  password: string;

  @Prop()
  @Field()
  first_name: string;

  @Prop()
  @Field()
  last_name: string;

  @Prop({ default: 'nanoid()' })
  verificationCode: string;

  @Prop({ default: null })
  passwordResetCode: string;

  @Prop({ default: false })
  is_email_verified: boolean;

  @Prop({ default: now() })
  @Field({ nullable: false })
  createdAt: Date;

  @Field(() => Address)
  address: Address;
}
export const UserSchema = SchemaFactory.createForClass(User);
