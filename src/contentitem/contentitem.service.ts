import { Injectable } from '@nestjs/common';
import { CreateContentitemInput } from './dto/create-contentitem.input';
import { UpdateContentitemInput } from './dto/update-contentitem.input';

@Injectable()
export class ContentitemService {
  create(createContentitemInput: CreateContentitemInput) {
    return 'This action adds a new contentitem';
  }

  findAll() {
    return `This action returns all contentitem`;
  }

  findOne(id: number) {
    return `This action returns a #${id} contentitem`;
  }

  update(id: number, updateContentitemInput: UpdateContentitemInput) {
    return `This action updates a #${id} contentitem`;
  }

  remove(id: number) {
    return `This action removes a #${id} contentitem`;
  }
}
