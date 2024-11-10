import { Module } from '@nestjs/common';
import { ItemRiskFlagService } from './item-risk-flag.service';
import { ItemRiskFlagResolver } from './item-risk-flag.resolver';

@Module({
  providers: [ItemRiskFlagResolver, ItemRiskFlagService],
})
export class ItemRiskFlagModule {}
