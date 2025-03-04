import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
@ObjectType()
export class Program {
  @Field(() => ID)
  _id: string;

  // @Prop({
  //   type: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  // })
  // @Field(() => [Course])
  // courseId: Course;

  @Prop()
  @Field()
  name: string;

  @Prop()
  @Field()
  tagline: string;

  @Prop()
  @Field()
  url: string;

  @Prop()
  @Field()
  contentId: string;

  @Prop()
  @Field()
  contentType: string;
}
export const ProgramSchema = SchemaFactory.createForClass(Program);
