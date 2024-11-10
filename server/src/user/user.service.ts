import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { Schema as MongooseSchema } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(CreateUserInput: CreateUserInput) {
    const createdUser = new this.userModel(CreateUserInput);
    return await createdUser.save();
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: MongooseSchema.Types.ObjectId) {
    return `This action returns a #${id} user`;
  }

  update(id: MongooseSchema.Types.ObjectId, updateUserInput: UpdateUserInput) {
    return `This action updates a #${id} user`;
  }

  remove(id: MongooseSchema.Types.ObjectId) {
    return `This action removes a #${id} user`;
  }
}
