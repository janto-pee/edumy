import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
// import { CourseModule } from './course/course.module';
// import { InstructorModule } from './instructor/instructor.module';
// import { SkillsModule } from './skills/skills.module';
// import { CourseGradeReportModule } from './course-grade-report/course-grade-report.module';
// import { CourseMetaDataModule } from './course-meta-data/course-meta-data.module';
// import { ItemGradeModule } from './item-grade/item-grade.module';
// import { ItemRiskFlagModule } from './item-risk-flag/item-risk-flag.module';
// import { EnrollmentReportModule } from './enrollment-report/enrollment-report.module';
// import { CourseMaterialModule } from './course-material/course-material.module';
// import { CourseModuleModule } from './course-module/course-module.module';
// import { CourseCurriculumModule } from './course-curriculum/course-curriculum.module';
// import { ProgramModule } from './program/program.module';
// import { ProgramMembershipModule } from './program-membership/program-membership.module';
// import { EnrollmentStateModule } from './enrollment-state/enrollment-state.module';
// import { UserSkillsetReportModule } from './user-skillset-report/user-skillset-report.module';
// import { SkillsetModule } from './skillset/skillset.module';
import { UserModule } from './user/user.module';
// import { SessionModule } from './session/session.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://root:secret@localhost:27017/HLS?authSource=admin',
    ),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
    }),
    UserModule,
    // SessionModule,
    // CourseModule,
    // UserModule,
    // SessionModule,
    // InstructorModule,
    // SkillsModule,
    // CourseGradeReportModule,
    // CourseMetaDataModule,
    // ItemGradeModule,
    // ItemRiskFlagModule,
    // EnrollmentReportModule,
    // CourseMaterialModule,
    // CourseModuleModule,
    // CourseCurriculumModule,
    // ProgramModule,
    // ProgramMembershipModule,
    // EnrollmentStateModule,
    // UserSkillsetReportModule,
    // SkillsetModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
