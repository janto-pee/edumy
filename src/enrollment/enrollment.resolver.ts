import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { EnrollmentService } from './enrollment.service';
import { Enrollment } from './entities/enrollment.entity';
import { CreateEnrollmentInput } from './dto/create-enrollment.input';
import { UpdateEnrollmentInput } from './dto/update-enrollment.input';

@Resolver(() => Enrollment)
export class EnrollmentResolver {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Mutation(() => Enrollment)
  createEnrollment(@Args('createEnrollmentInput') createEnrollmentInput: CreateEnrollmentInput) {
    return this.enrollmentService.create(createEnrollmentInput);
  }

  @Query(() => [Enrollment], { name: 'enrollment' })
  findAll() {
    return this.enrollmentService.findAll();
  }

  @Query(() => Enrollment, { name: 'enrollment' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.enrollmentService.findOne(id);
  }

  @Mutation(() => Enrollment)
  updateEnrollment(@Args('updateEnrollmentInput') updateEnrollmentInput: UpdateEnrollmentInput) {
    return this.enrollmentService.update(updateEnrollmentInput.id, updateEnrollmentInput);
  }

  @Mutation(() => Enrollment)
  removeEnrollment(@Args('id', { type: () => Int }) id: number) {
    return this.enrollmentService.remove(id);
  }
}
