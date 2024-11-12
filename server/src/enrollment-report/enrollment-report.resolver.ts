import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { EnrollmentReportService } from './enrollment-report.service';
import { EnrollmentReport } from './entities/enrollment-report.entity';
import { CreateEnrollmentReportInput } from './dto/create-enrollment-report.input';
import { UpdateEnrollmentReportInput } from './dto/update-enrollment-report.input';
import { Schema as MongooseSchema } from 'mongoose';

@Resolver(() => EnrollmentReport)
export class EnrollmentReportResolver {
  constructor(
    private readonly enrollmentReportService: EnrollmentReportService,
  ) {}

  @Mutation(() => EnrollmentReport)
  createEnrollmentReport(
    @Args('createEnrollmentReportInput')
    createEnrollmentReportInput: CreateEnrollmentReportInput,
  ) {
    return this.enrollmentReportService.create(createEnrollmentReportInput);
  }

  @Query(() => [EnrollmentReport], { name: 'enrollmentReport' })
  findAll() {
    return this.enrollmentReportService.findAll();
  }

  @Query(() => EnrollmentReport, { name: 'enrollmentReport' })
  findOne(
    @Args('id', { type: () => String }) id: MongooseSchema.Types.ObjectId,
  ) {
    return this.enrollmentReportService.findOne(id);
  }

  @Mutation(() => EnrollmentReport)
  updateEnrollmentReport(
    @Args('updateEnrollmentReportInput')
    updateEnrollmentReportInput: UpdateEnrollmentReportInput,
  ) {
    return this.enrollmentReportService.update(
      updateEnrollmentReportInput._id,
      updateEnrollmentReportInput,
    );
  }

  @Mutation(() => EnrollmentReport)
  removeEnrollmentReport(
    @Args('id', { type: () => String }) id: MongooseSchema.Types.ObjectId,
  ) {
    return this.enrollmentReportService.remove(id);
  }
}
