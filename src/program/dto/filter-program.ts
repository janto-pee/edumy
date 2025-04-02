import { Field, InputType, Int, Float } from '@nestjs/graphql';

@InputType()
export class ProgramFilterDto {
  @Field(() => String, { nullable: true })
  title?: string;

  @Field(() => Float, { nullable: true })
  url?: string;

  @Field(() => String, { nullable: true })
  tagline?: string;

  @Field(() => String, { nullable: true })
  sortBy?: string;

  @Field(() => String, { nullable: true })
  sortDirection?: 'asc' | 'desc';
}
