import { Injectable } from '@nestjs/common';
import { CreateSkillsetInput } from './dto/create-skillset.input';
import { UpdateSkillsetInput } from './dto/update-skillset.input';

@Injectable()
export class SkillsetService {
  create(createSkillsetInput: CreateSkillsetInput) {
    return 'This action adds a new skillset';
  }

  findAll() {
    return `This action returns all skillset`;
  }

  findOne(id: number) {
    return `This action returns a #${id} skillset`;
  }

  update(id: number, updateSkillsetInput: UpdateSkillsetInput) {
    return `This action updates a #${id} skillset`;
  }

  remove(id: number) {
    return `This action removes a #${id} skillset`;
  }
}
