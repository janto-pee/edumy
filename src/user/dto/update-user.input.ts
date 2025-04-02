import { CreateUserInput } from './create-user.input';
import { InputType, Field, PartialType, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  // @IsNotEmpty()
  @Field(() => ID)
  @IsOptional()
  @IsString()
  id: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  is_email_verified?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
