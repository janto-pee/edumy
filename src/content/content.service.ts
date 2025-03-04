import { Injectable } from '@nestjs/common';
import { CreateContentInput } from './dto/create-content.input';
import { UpdateContentInput } from './dto/update-content.input';
import { InjectModel } from '@nestjs/mongoose';
import { Content } from './entities/content.entity';
import { Model } from 'mongoose';

@Injectable()
export class ContentService {
  constructor(
    @InjectModel(Content.name) private contentModel: Model<Content>,
  ) {}

  async create(createContentDto: CreateContentInput): Promise<Content> {
    const createdContent = await this.contentModel.create(createContentDto);
    return createdContent;
  }

  async findAll(): Promise<Content[]> {
    return this.contentModel.find().exec();
  }

  async findOne(id: string) {
    return await this.contentModel.findById(id);
  }

  async update(id: string, updateContentInput: UpdateContentInput) {
    return await this.contentModel.findByIdAndUpdate(id, updateContentInput, {
      new: true,
    });
  }

  async remove(id: string) {
    return await this.contentModel.findByIdAndDelete(id);
  }
}
