import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@ObjectType()
@Schema()
export class CourseMaterial {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
  @Prop() id: string;
  @Prop() module: string;
}
export const CourseMaterialSchema =
  SchemaFactory.createForClass(CourseMaterial);
