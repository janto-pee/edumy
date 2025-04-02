import { ObjectType } from '@nestjs/graphql';
import { PaginatedResponse } from 'src/common/pagination/pagination-response';
import { CourseMetaDatum } from '../entities/coursemetadatum.entity';

@ObjectType()
export class CourseMetaDatumPaginationResponse extends PaginatedResponse(
  CourseMetaDatum,
) {}
