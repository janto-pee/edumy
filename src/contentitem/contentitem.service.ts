import { Injectable } from '@nestjs/common';
import { CreateContentitemInput } from './dto/create-contentitem.input';
import { UpdateContentitemInput } from './dto/update-contentitem.input';
import { InjectModel } from '@nestjs/mongoose';
import { Contentitem } from './entities/contentitem.entity';
import { Model } from 'mongoose';

@Injectable()
export class ContentitemService {
  constructor(
    @InjectModel(Contentitem.name) private contentItemModel: Model<Contentitem>,
  ) {}

  async create(
    createContentItemDto: CreateContentitemInput,
  ): Promise<Contentitem> {
    const createdContent =
      await this.contentItemModel.create(createContentItemDto);
    return createdContent;
  }

  async findAll(): Promise<Contentitem[]> {
    return this.contentItemModel.find().exec();
  }

  async findOne(id: string) {
    return await this.contentItemModel.findById(id);
  }

  async update(id: string, updateContentInput: UpdateContentitemInput) {
    return await this.contentItemModel.findByIdAndUpdate(
      id,
      updateContentInput,
      { new: true },
    );
  }

  async remove(id: string) {
    return await this.contentItemModel.findByIdAndDelete(id);
  }
}
