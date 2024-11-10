// import { ObjectType, Field, Int } from '@nestjs/graphql';
// import { Prop } from '@nestjs/mongoose';

// @ObjectType()
// export class User {
//   @Prop({ required: true, unique: true })
//   @Field()
//   username: string;

//   @Prop({ required: true, unique: true })
//   @Field()
//   email: string;

//   @Prop({ required: true })
//   password: string;

//   @Prop({ required: true, default: 'abcdef' })
//   verificationcode: string;

//   @Prop()
//   passwordResetCode: string;

//   @Prop({ default: false })
//   verified: boolean;
// }
import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@ObjectType()
@Schema()
export class User {
  @Field(() => String, { description: 'Example field (placeholder)' })
  _id: MongooseSchema.Types.ObjectId;

  @Field(() => String)
  @Prop()
  name: string;

  @Field(() => String)
  @Prop()
  email: number;

  @Field(() => String)
  @Prop()
  password: string;
}
// export type UserDocument = User && Docum
export const UserSchema = SchemaFactory.createForClass(User);
