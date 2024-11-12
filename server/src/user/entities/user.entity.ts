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
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@ObjectType()
@Schema()
export class User {
  @Field(() => ID)
  _id: MongooseSchema.Types.ObjectId;

  @Prop()
  @Field({ nullable: false })
  name: string;

  @Prop()
  @Field({ nullable: false })
  email: string;

  @Prop()
  @Field({ nullable: false })
  password: string;
}
// export type UserDocument = User && Docum

export const UserSchema = SchemaFactory.createForClass(User);
