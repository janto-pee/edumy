import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import mongoose, { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
// import { User } from 'src/user/entities/user.entity';

export type AddressDocument = HydratedDocument<Address>;

@ObjectType()
@Schema()
export class Address {
  @Field(() => ID)
  _id: MongooseSchema.Types.ObjectId;

  // @Prop({ type: { type: mongoose.Schema.Types.ObjectId, ref: User.name } })
  // @Field(() => User)
  // user: User;

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
}
export const AddressSchema = SchemaFactory.createForClass(Address);
