import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AddressFilterDto {
  @Field(() => String, { nullable: true })
  street: string;

  @Field(() => String, { nullable: true })
  city: string;

  @Field(() => String, { nullable: true })
  state_province_name: string;

  @Field(() => String, { nullable: true })
  postal_code: string;

  @Field(() => String, { nullable: true })
  country_code: string;

  @Field(() => String, { nullable: true })
  country: string;

  @Field(() => String, { nullable: true })
  sortBy?: string;

  @Field(() => String, { nullable: true })
  sortDirection?: 'asc' | 'desc';
}
