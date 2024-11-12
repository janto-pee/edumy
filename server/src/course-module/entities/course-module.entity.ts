import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Prop, SchemaFactory } from '@nestjs/mongoose';

@ObjectType()
export class CourseModule {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
  @Prop()
  id: string;

  @Prop()
  name: string;

  @Prop()
  lessons: string;

  @Prop()
  items: string;

  @Prop()
  itemType: string;

  @Prop()
  deeplinkUrl: string;
}
export const CourseModuleSchema = SchemaFactory.createForClass(CourseModule);
