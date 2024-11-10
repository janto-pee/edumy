import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { EnrollmentStateService } from './enrollment-state.service';
import { EnrollmentState } from './entities/enrollment-state.entity';
import { CreateEnrollmentStateInput } from './dto/create-enrollment-state.input';
import { UpdateEnrollmentStateInput } from './dto/update-enrollment-state.input';

@Resolver(() => EnrollmentState)
export class EnrollmentStateResolver {
  constructor(private readonly enrollmentStateService: EnrollmentStateService) {}

  @Mutation(() => EnrollmentState)
  createEnrollmentState(@Args('createEnrollmentStateInput') createEnrollmentStateInput: CreateEnrollmentStateInput) {
    return this.enrollmentStateService.create(createEnrollmentStateInput);
  }

  @Query(() => [EnrollmentState], { name: 'enrollmentState' })
  findAll() {
    return this.enrollmentStateService.findAll();
  }

  @Query(() => EnrollmentState, { name: 'enrollmentState' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.enrollmentStateService.findOne(id);
  }

  @Mutation(() => EnrollmentState)
  updateEnrollmentState(@Args('updateEnrollmentStateInput') updateEnrollmentStateInput: UpdateEnrollmentStateInput) {
    return this.enrollmentStateService.update(updateEnrollmentStateInput.id, updateEnrollmentStateInput);
  }

  @Mutation(() => EnrollmentState)
  removeEnrollmentState(@Args('id', { type: () => Int }) id: number) {
    return this.enrollmentStateService.remove(id);
  }
}
