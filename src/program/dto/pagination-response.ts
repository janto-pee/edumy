import { ObjectType } from '@nestjs/graphql';
import { PaginatedResponse } from 'src/common/pagination/pagination-response';
import { Program } from '../entities/program.entity';

@ObjectType()
export class ProgramPaginationResponse extends PaginatedResponse(Program) {}
