import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import config from 'config';
// import { customAlphabet } from 'nanoid';

export type UserDocument = User & mongoose.Document;
// const nanoid = customAlphabet('0123456789abcdefghi');
// export type UserDocument = HydratedDocument<User>;

@Schema()
@ObjectType()
export class User {
  @Field(() => ID)
  _id: number;

  @Prop({ required: true, unique: true })
  @Field()
  username: string;

  @Prop({ required: true, unique: true })
  @Field()
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, default: 'abcdef' })
  verificationcode: string;

  @Prop()
  passwordResetCode: string;

  @Prop({ default: false })
  verified: boolean;

  comparePassword: (candidatePassword: string) => boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ email: 1 });

UserSchema.pre('save', async function (next: any) {
  let user = this as UserDocument;
  console.log('model called 1', user.password);
  if (!user.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(config.get<number>('saltWorkFactor'));
  const hash = bcrypt.hashSync(user.password, salt);
  user.password = hash;

  return next();
});

UserSchema.methods.comparePassword = async function (
  candidatePassword: string,
) {
  const user = this as UserDocument;

  return bcrypt.compare(candidatePassword, user.password).catch((e) => false);
};
