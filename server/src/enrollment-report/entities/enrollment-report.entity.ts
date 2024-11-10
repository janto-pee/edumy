import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Prop } from '@nestjs/mongoose';

@ObjectType()
export class EnrollmentReport {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
  @Prop()
  approxTotalCourseHrs: string;

  @Prop()
  overallProgress: string;

  @Prop()
  membershipState: string;

  @Prop()
  contentId: string;

  @Prop()
  externalId: string;

  @Prop()
  lastActivityAt: string;

  @Prop()
  id: string;

  @Prop()
  grade: string;

  @Prop()
  contentType: string;

  @Prop()
  programId: string;

  @Prop()
  enrolledAt: string;

  @Prop()
  isCompleted: string;

  @Prop()
  completedAt: string;

  @Prop()
  collectionId: string;

  @Prop()
  collectionName: string;

  @Prop()
  deletedAt: string;

  @Prop()
  updatedAt: string;

  @Prop()
  contentName: string;

  @Prop()
  contentSlug: string;

  @Prop()
  partnerNames: string;

  @Prop()
  fullName: string;

  @Prop()
  email: string;

  @Prop()
  programName: string;

  @Prop()
  programSlug: string;

  @Prop()
  contractId: string;

  @Prop()
  contractName: string;
}
