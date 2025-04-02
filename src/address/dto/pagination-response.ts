import { ObjectType } from '@nestjs/graphql';
import { PaginatedResponse } from 'src/common/pagination/pagination-response';
import { Address } from '../entities/address.entity';

@ObjectType()
export class AddressPaginationResponse extends PaginatedResponse(Address) {}
