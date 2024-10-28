import { Injectable } from '@nestjs/common';
import { CreateSessionInput } from './dto/create-session.input';
import { UpdateSessionInput } from './dto/update-session.input';
import { Session } from './entities/session.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class SessionService {
  constructor(
    @InjectModel(Session.name) private sessionModel: Model<Session>,
  ) {}

  async create(createSessionInput: CreateSessionInput) {
    const createdUser = new this.sessionModel(createSessionInput);
    return await createdUser.save();
  }

  async findOne(id: number): Promise<Session> {
    return await this.sessionModel.findById(id).exec();
  }

  async update(id: number) {
    return this.sessionModel.findByIdAndUpdate(
      id,
      { valid: false },
      {
        new: true,
      },
    );
  }

  async resIssueAccessToken() {
    return `This action returns all session`;
  }
}
