import { ObjectType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';
import { PaginatedResponse } from 'src/common/pagination/pagination-response';

@ObjectType()
export class PaginatedUserResponse extends PaginatedResponse(User) {}
