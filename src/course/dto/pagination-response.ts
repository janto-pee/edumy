import { ObjectType } from '@nestjs/graphql';
import { Course } from '../entities/course.entity';
import { PaginatedResponse } from 'src/common/pagination/pagination-response';

@ObjectType()
export class CoursePaginationResponse extends PaginatedResponse(Course) {}
