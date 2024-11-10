import { Injectable } from '@nestjs/common';
import { CreateItemRiskFlagInput } from './dto/create-item-risk-flag.input';
import { UpdateItemRiskFlagInput } from './dto/update-item-risk-flag.input';

@Injectable()
export class ItemRiskFlagService {
  create(createItemRiskFlagInput: CreateItemRiskFlagInput) {
    return 'This action adds a new itemRiskFlag';
  }

  findAll() {
    return `This action returns all itemRiskFlag`;
  }

  findOne(id: number) {
    return `This action returns a #${id} itemRiskFlag`;
  }

  update(id: number, updateItemRiskFlagInput: UpdateItemRiskFlagInput) {
    return `This action updates a #${id} itemRiskFlag`;
  }

  remove(id: number) {
    return `This action removes a #${id} itemRiskFlag`;
  }
}
