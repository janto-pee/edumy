import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
@ObjectType()
export class Enrollment {
  @Field(() => ID)
  _id: string;

  // @Prop({
  //   type: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  // })
  // @Field(() => [Course])
  // courseId: Course;

  @Prop()
  @Field()
  title: string;

  @Prop()
  @Field()
  contentType: string;
}
export const EnrollmentSchema = SchemaFactory.createForClass(Enrollment);
