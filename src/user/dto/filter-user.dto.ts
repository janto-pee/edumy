import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsString, IsEnum, IsBoolean } from 'class-validator';
import { UserRole } from '../entities/user.entity';

@InputType()
export class FilterUserDto {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  search?: string;

  @Field(() => UserRole, { nullable: true })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  is_email_verified?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  sortDirection?: 'asc' | 'desc';
}
