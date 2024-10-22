import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(CreateUserInput: CreateUserInput) {
    const createdUser = new this.userModel(CreateUserInput);
    return await createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  async findOne(id: number): Promise<User> {
    return await this.userModel.findById(id).exec();
  }

  async update(id: number, updateUserInput: UpdateUserInput) {
    return this.userModel.findByIdAndUpdate(id, updateUserInput, {
      new: true,
    });
  }

  async remove(id: number) {
    return this.userModel.findByIdAndDelete(id);
  }
}
