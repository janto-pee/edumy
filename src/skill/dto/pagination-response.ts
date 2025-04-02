import { ObjectType } from '@nestjs/graphql';
import { PaginatedResponse } from 'src/common/pagination/pagination-response';
import { Skill } from '../entities/skill.entity';

@ObjectType()
export class SkillPaginationResponse extends PaginatedResponse(Skill) {}
