import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, now, Schema as MongooseSchema } from 'mongoose';
import { Address } from 'src/address/entities/address.entity';
import { v4 } from 'uuid';

export enum UserRole {
  USER = 'USER',
  INSTRUCTOR = 'INSTRUCTOR',
  ADMIN = 'ADMIN',
}

registerEnumType(UserRole, {
  name: 'UserRole',
  description: 'User role types',
});

@Schema({ timestamps: true })
@ObjectType()
export class User extends Document {
  @Field(() => ID)
  declare _id: string;

  @Prop({ unique: true, required: true })
  @Field()
  username: string;

  @Prop({ unique: true, required: true })
  @Field()
  email: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ required: true })
  @Field()
  first_name: string;

  @Prop({ required: true })
  @Field()
  last_name: string;

  @Prop({ default: v4 })
  verificationCode: string;

  @Prop({ default: null })
  passwordResetCode: string;

  @Prop({ default: false })
  @Field()
  is_email_verified: boolean;

  @Prop({ default: now() })
  @Field()
  createdAt: Date;

  @Prop({ default: now() })
  @Field()
  updatedAt: Date;

  @Prop({ default: UserRole.USER, enum: UserRole, type: String })
  @Field(() => UserRole)
  role: UserRole;

  // @Prop({ default: [] })
  // @Field(() => [String], { nullable: true })
  // roles: string[];

  @Prop({ default: true })
  @Field()
  is_active: boolean;

  @Prop({ default: null })
  @Field({ nullable: true })
  profile_picture: string;

  @Prop({ default: null })
  @Field({ nullable: true })
  bio: string;

  @Prop({ default: [] })
  @Field(() => [String], { nullable: true })
  interests: string[];

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Course' }] })
  @Field(() => [String], { nullable: true })
  enrolled_courses: string[];

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Course' }] })
  @Field(() => [String], { nullable: true })
  created_courses: string[];

  @Prop({ default: null })
  @Field({ nullable: true })
  last_login: Date;

  @Field(() => Address, { nullable: true })
  address: Address;

  @Field()
  fullName: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Virtual field for full name
UserSchema.virtual('fullName').get(function () {
  return `${this.first_name} ${this.last_name}`;
});

// Indexes for faster queries
UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ roles: 1 });
