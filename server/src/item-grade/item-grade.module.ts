import { Module } from '@nestjs/common';
import { ItemGradeService } from './item-grade.service';
import { ItemGradeResolver } from './item-grade.resolver';

@Module({
  providers: [ItemGradeResolver, ItemGradeService],
})
export class ItemGradeModule {}
