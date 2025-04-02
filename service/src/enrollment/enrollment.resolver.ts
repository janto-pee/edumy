import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { EnrollmentService } from './enrollment.service';
import { Enrollment } from './entities/enrollment.entity';
import { CreateEnrollmentInput } from './dto/create-enrollment.input';
import { UpdateEnrollmentInput } from './dto/update-enrollment.input';

@Resolver(() => Enrollment)
export class EnrollmentResolver {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Mutation(() => Enrollment)
  async createEnrollment(
    @Args('createEnrollmentInput') createEnrollmentInput: CreateEnrollmentInput,
  ) {
    return await this.enrollmentService.create(createEnrollmentInput);
  }

  @Query(() => [Enrollment], { name: 'enrollments' })
  async findAll() {
    return await this.enrollmentService.findAll();
  }

  @Query(() => Enrollment, { name: 'enrollment' })
  async findOne(@Args('id', { type: () => String }) id: string) {
    return await this.enrollmentService.findOne(id);
  }

  @Mutation(() => Enrollment)
  async updateEnrollment(
    @Args('updateEnrollmentInput') updateEnrollmentInput: UpdateEnrollmentInput,
  ) {
    return await this.enrollmentService.update(
      updateEnrollmentInput.id,
      updateEnrollmentInput,
    );
  }

  @Mutation(() => Enrollment)
  async removeEnrollment(@Args('id', { type: () => String }) id: string) {
    return await this.enrollmentService.remove(id);
  }
}
