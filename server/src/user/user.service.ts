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

  async create(CreateUserInput: CreateUserInput): Promise<User> {
    const createdUser = new this.userModel(CreateUserInput);
    return await createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: MongooseSchema.Types.ObjectId) {
    return await this.userModel.findById(id);
  }

  async update(
    id: MongooseSchema.Types.ObjectId,
    updateUserInput: UpdateUserInput,
  ) {
    return await this.userModel.findByIdAndUpdate(id, updateUserInput);
  }

  async remove(id: MongooseSchema.Types.ObjectId) {
    return await this.userModel.findByIdAndDelete(id);
  }
}
