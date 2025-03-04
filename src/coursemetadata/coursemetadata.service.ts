import { Injectable } from '@nestjs/common';
import { CreateCoursemetadatumInput } from './dto/create-coursemetadatum.input';
import { UpdateCoursemetadatumInput } from './dto/update-coursemetadatum.input';

@Injectable()
export class CoursemetadataService {
  create(createCoursemetadatumInput: CreateCoursemetadatumInput) {
    return 'This action adds a new coursemetadatum';
  }

  findAll() {
    return `This action returns all coursemetadata`;
  }

  findOne(id: number) {
    return `This action returns a #${id} coursemetadatum`;
  }

  update(id: number, updateCoursemetadatumInput: UpdateCoursemetadatumInput) {
    return `This action updates a #${id} coursemetadatum`;
  }

  remove(id: number) {
    return `This action removes a #${id} coursemetadatum`;
  }
}
