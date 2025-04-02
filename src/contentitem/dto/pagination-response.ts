import { ObjectType } from '@nestjs/graphql';
import { PaginatedResponse } from 'src/common/pagination/pagination-response';
import { ContentItem } from '../entities/contentitem.entity';

@ObjectType()
export class ContentItemPaginationResponse extends PaginatedResponse(
  ContentItem,
) {}
