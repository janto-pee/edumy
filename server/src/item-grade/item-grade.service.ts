import { Injectable } from '@nestjs/common';
import { CreateItemGradeInput } from './dto/create-item-grade.input';
import { UpdateItemGradeInput } from './dto/update-item-grade.input';

@Injectable()
export class ItemGradeService {
  create(createItemGradeInput: CreateItemGradeInput) {
    return 'This action adds a new itemGrade';
  }

  findAll() {
    return `This action returns all itemGrade`;
  }

  findOne(id: number) {
    return `This action returns a #${id} itemGrade`;
  }

  update(id: number, updateItemGradeInput: UpdateItemGradeInput) {
    return `This action updates a #${id} itemGrade`;
  }

  remove(id: number) {
    return `This action removes a #${id} itemGrade`;
  }
}
