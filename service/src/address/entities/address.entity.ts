import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/user/entities/user.entity';

@Schema()
@ObjectType()
export class Address {
  @Field(() => ID)
  _id: string;

  @Prop()
  @Field()
  street: string;

  @Prop()
  @Field()
  street2: string;

  @Prop()
  @Field()
  city: string;

  @Prop()
  @Field()
  state_province_code: string;

  @Prop()
  @Field()
  state_province_name: string;

  @Prop()
  @Field()
  postal_code: string;

  @Prop()
  @Field()
  country_code: string;

  @Prop()
  @Field()
  country: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  @Field()
  userId: string;

  @Field(() => User)
  user: User;
}
export const AddressSchema = SchemaFactory.createForClass(Address);
