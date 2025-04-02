import { Injectable } from '@nestjs/common';
import * as DataLoader from 'dataloader';
import { CourseService } from './course.service';
import { Course } from './entities/course.entity';

@Injectable()
export class CourseLoaderService {
  constructor(private readonly courseService: CourseService) {}

  createCoursesLoader() {
    return new DataLoader<string, Course>(async (ids: any) => {
      // return new DataLoader<string, Course>(async (ids: string[]) => {
      const courses = await this.courseService.findByIds(ids);
      const coursesMap = new Map(
        courses.map((course) => [course._id.toString(), course]),
      );
      return ids.map((id) => coursesMap.get(id) || null);
    });
  }
}
