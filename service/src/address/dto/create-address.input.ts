import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateAddressInput {
  @Field()
  street: string;

  @Field()
  street2: string;

  @Field()
  city: string;

  @Field()
  state_province_code: string;

  @Field()
  state_province_name: string;

  @Field()
  postal_code: string;

  @Field()
  country_code: string;

  @Field()
  country: string;

  @Field()
  userId: string;
}
