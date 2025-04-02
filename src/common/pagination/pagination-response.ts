import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Type } from '@nestjs/common';

export class PaginationResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function PaginatedResponse<T>(classRef: Type<T>): any {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedResponseClass {
    @Field(() => [classRef])
    items: T[];

    @Field(() => Int)
    total: number;

    @Field(() => Int)
    page: number;

    @Field(() => Int)
    limit: number;

    @Field(() => Int)
    totalPages: number;
  }
  return PaginatedResponseClass;
}

// @ObjectType()
// export class CoursePaginationResponse extends PaginatedResponse(Program) {}
// export class CoursePaginationResponse extends PaginatedResponse(Program) {}
// export class CoursePaginationResponse extends PaginatedResponse(Program) {}
