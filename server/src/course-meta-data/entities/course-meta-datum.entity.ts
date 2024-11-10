import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Prop } from '@nestjs/mongoose';

@ObjectType()
export class CourseMetaDatum {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
  @Prop()
  skills: string;

  @Prop()
  estimatedLearningTime: string;

  @Prop()
  promoPhoto: string;

  @Prop()
  domainTypes: string;
}
