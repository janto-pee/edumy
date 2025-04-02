import { Field, InputType, Int, Float } from '@nestjs/graphql';

@InputType()
export class ContentItemFilterDto {
  @Field(() => String, { nullable: true })
  title?: string;

  @Field(() => Float, { nullable: true })
  minPrice?: number;

  @Field(() => Float, { nullable: true })
  maxPrice?: number;

  @Field(() => String, { nullable: true })
  category?: string;

  @Field(() => String, { nullable: true })
  sortBy?: string;

  @Field(() => String, { nullable: true })
  sortDirection?: 'asc' | 'desc';
}
