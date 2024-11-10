import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Prop } from '@nestjs/mongoose';

@ObjectType()
export class Skillset {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;

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
