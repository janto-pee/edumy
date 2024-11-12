import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

@ObjectType()
export class Skillset {
  @Field()
  _id: MongooseSchema.Types.ObjectId;

  @Prop()
  skillsetName: string;

  @Prop()
  skillsetId: string;

  @Prop()
  skillsetDescription: string;

  @Prop()
  programId: string;

  @Prop()
  programName: string;

  @Prop()
  deeplink: string;

  @Prop()
  skills: string;
}
export const SkillsetSchema = SchemaFactory.createForClass(Skillset);
