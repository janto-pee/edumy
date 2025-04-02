import { ObjectType } from '@nestjs/graphql';
import { PaginatedResponse } from 'src/common/pagination/pagination-response';
import { Content } from '../entities/content.entity';

@ObjectType()
export class ContentPaginationResponse extends PaginatedResponse(Content) {}
