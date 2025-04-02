import { CreateAddressInput } from './create-address.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateAddressInput extends PartialType(CreateAddressInput) {
  @Field(() => String)
  _id: string;
}
