import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserInput): Promise<User> {
    const createdUser = await this.userModel.create(createUserDto);
    return createdUser;
  }

  async findAll(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  async findOne(id: string) {
    return await this.userModel.findById(id);
  }

  async update(id: string, updateUserInput: UpdateUserInput) {
    return await this.userModel.findByIdAndUpdate(id, updateUserInput, {
      new: true,
    });
  }

  async remove(id: string) {
    return await this.userModel.findByIdAndDelete(id);
  }
}
