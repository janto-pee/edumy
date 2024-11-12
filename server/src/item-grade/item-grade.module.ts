import { Module } from '@nestjs/common';
import { ItemGradeService } from './item-grade.service';
import { ItemGradeResolver } from './item-grade.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { ItemGrade, ItemGradeSchema } from './entities/item-grade.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ItemGrade.name, schema: ItemGradeSchema },
    ]),
  ],
  providers: [ItemGradeResolver, ItemGradeService],
})
export class ItemGradeModule {}
