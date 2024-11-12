import { Module } from '@nestjs/common';
import { ItemRiskFlagService } from './item-risk-flag.service';
import { ItemRiskFlagResolver } from './item-risk-flag.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ItemRiskFlag,
  ItemRiskFlagSchema,
} from './entities/item-risk-flag.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ItemRiskFlag.name, schema: ItemRiskFlagSchema },
    ]),
  ],
  providers: [ItemRiskFlagResolver, ItemRiskFlagService],
})
export class ItemRiskFlagModule {}
