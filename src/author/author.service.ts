import { Injectable } from '@nestjs/common';
import { CreateAuthorInput } from './dto/create-author.input';
import { UpdateAuthorInput } from './dto/update-author.input';
import { InjectModel } from '@nestjs/mongoose';
import { Author } from './entities/author.entity';
import { Model } from 'mongoose';

@Injectable()
export class AuthorService {
  constructor(@InjectModel(Author.name) private authorModel: Model<Author>) {}

  async create(createAuthorDto: CreateAuthorInput): Promise<Author> {
    // console.log('create auth', createAuthorDto);
    // const createdAuthor = new this.authorModel(createAuthorDto);
    const createdAuthor = await this.authorModel.create(createAuthorDto);
    return createdAuthor;
  }

  async findAll(): Promise<Author[]> {
    return this.authorModel.find().exec();
  }

  async findOne(id: string) {
    return await this.authorModel.findById(id);
  }

  async update(id: string, updateAuthorInput: UpdateAuthorInput) {
    return await this.authorModel.findByIdAndUpdate(id, updateAuthorInput, {
      new: true,
    });
  }

  async remove(id: string) {
    return await this.authorModel.findByIdAndDelete(id);
  }
}
