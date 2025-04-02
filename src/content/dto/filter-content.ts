import { Field, InputType, Int, Float } from '@nestjs/graphql';

@InputType()
export class ContentFilterDto {
  @Field(() => String, { nullable: true })
  title: string;

  @Field(() => String, { nullable: true })
  content: string;

  @Field(() => String, { nullable: true })
  text: string;

  @Field(() => String, { nullable: true })
  duration: string;

  @Field(() => String, { nullable: true })
  sortBy?: string;

  @Field(() => String, { nullable: true })
  sortDirection?: 'asc' | 'desc';
}
